import { useEffect, useState } from 'react';
import { backendURL } from '../Globals';
import { useNavigate } from 'react-router-dom';
let CreateUserComponent = (props) =>  {
    let {createNotificacion} = props
    let [ email, setEmail ] = useState(null);
    let [ password, setPassword ] = useState(null);
    let [ message, setMessage ] = useState("");
    let [error, setError] = useState({})
    

    let navigate = useNavigate()
    let changeEmail = (e) => {
        setEmail(e.currentTarget.value)
    }
    let changePassword = (e) => {
        setPassword(e.currentTarget.value)
    } 
    useEffect(() => {
        checkErrors()
    },[email,password])

    let checkErrors = () => {
        let updatedErrors = {}

        if(email?.length < 5 ){
            updatedErrors.email = "Invalid email"
        }
        if(password ==="" || password?.length < 5 ){
            updatedErrors.password = "Password must be over 5 characters"
        }
        setError(updatedErrors)
    }
    let onClickCreate = async () => {
        let response = await fetch(backendURL+"/users/", { 
            method:'POST',
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({
                email: email,
                password: password
                }) 
        }) 
        if (response.ok){
            console.log(createNotificacion("User created succesfully, please log in"))
            navigate("/login")
        }else{
            setMessage("Error")
        }
        
    }
    
    return(
        <>
            <h2>Register</h2>
            { message !== "" && <h3 className='errorMessage'>{ message }</h3>}
            <div className="center-box">
                <div className="from-group">
                    <input type="text" placeholder="Email:" onChange={changeEmail }/>
                </div>
                { error.email && <p className='errorForm'>{error.email} </p>}
                <div className="from-group">
                    <input type="password" placeholder="Password:" onChange={changePassword }/>
                </div>
                { error.password && <p className='errorForm'>{error.password} </p>}
                <button className='button_friends' onClick={onClickCreate}>Create Account</button>
            </div>
        </>
    )

}


export default CreateUserComponent