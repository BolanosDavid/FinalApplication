import { useEffect, useState } from "react";
import { backendURL } from "../Globals";
import { useNavigate } from "react-router-dom";
let AddFriendsComponent = (props) => {
    let {createNotificacion, setLogin} = props
    let [email, setEmail] = useState(null)
    let [message,setMessage] = useState("")
    let [error, setError] = useState({})
    let navigate = useNavigate()
    
    useEffect(() => {
        checkErrors()
    },[email])

    let changeEmail = (e) => {
        setEmail(e.currentTarget.value)
    }    
    let checkErrors = () => {
        let updatedErrors = {}

        if(email?.length < 5 ){
            updatedErrors.email = "Invalid email"
        }
        setError(updatedErrors)
    }

    let onClickAdd = async () => {
        let response = await fetch(backendURL+"/friends?apiKey="+localStorage.getItem("apiKey"), { 
            method:'POST',
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({
                email: email,
                }) 
        }) 
        if (response.status === 401){
            createNotificacion("You need to log in first")
            setLogin(false)
            navigate("/login")

        }
        if (response.ok){
            console.log(createNotificacion("Friend added succesfully"))
            navigate("/friends")
        }else{
            let jsonData = await response.json()
            setMessage(jsonData)
        }
    }
    return (
        <div>
            <h2>Add friends</h2>
            {message !== "" && <h3 className="errorMessage">{message}</h3>}
            <div className="center-box"> 
                <div className="form-group"> 
                    <input type="text" placeholder="Email:" onChange={changeEmail }/>
                </div>  
                { error?.email && <p className='errorForm'>{error.email} </p>}
                <button onClick={onClickAdd}>Añadir</button>                           
            </div>
        </div>
    )




}
export default AddFriendsComponent;