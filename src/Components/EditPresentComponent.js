import { useEffect, useState } from "react";
import { backendURL } from "../Globals";
import { useNavigate, useParams } from "react-router-dom";

let EditPresentComponent = (props) => {
    let {createNotificacion,setLogin} = props
    let [present, setPresent] = useState({})
    let [message,setMessage] = useState("")
    let { presentId } = useParams();
    let navigate = useNavigate()
    useEffect( () => {
        getPresent()
    }, [])

    let changeProperty = (propertyName, e) => {
        let newItem = {...present, [propertyName] : e.currentTarget.value }

        setPresent(newItem)
    } 
    let onClickEdit = async () => {
        let response = await fetch(backendURL+"/presents/"+presentId+"?apiKey="+localStorage.getItem("apiKey"), { 
            method:'PUT',
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify(present) 
        }) 
        if (response.ok){
            createNotificacion("Present edited succesfully")
            navigate("/presents/")
        
        }else{
            let jsonData = await response.json()
            setMessage(jsonData)
        }
        
    }
  let getPresent = async () => {
    let response = await fetch(backendURL+"/presents/"+presentId+"/?apiKey="+localStorage.getItem("apiKey"))
    if(response.status === 401){
        navigate("/login")
        createNotificacion("You need to be log in first")
        setLogin(false)
    }
    if (response.ok){
        let jsonData = await response.json()
        setPresent(jsonData)
        
    }else{
        setMessage("Error")
    }
}
    return (
        <div>
            <h2>Edit Present: {present.name}</h2>
            {message !== "" && <h3 className="errorMessage">{message}</h3>}
            <div className="center-box"> 
                <div className="form-group"> 
                    <input type="text" placeholder="name:" value={present.name} onChange={e =>  changeProperty("name",e)} />
                </div>  

                <div className="form-group"> 
                    <input type="text" placeholder="description" value={present.description } onChange={e =>  changeProperty("description",e)} />
                </div>

                <div className="form-group"> 
                    <input type="text" placeholder="url" value={present.url} onChange={e =>  changeProperty("url",e)} />
                </div>

                <div className="form-group"> 
                    <input type="number" placeholder="price"  value={present.price} onChange={e =>  changeProperty("price",e)} />
                </div>
                <button className="button_friends" onClick={onClickEdit}>Edit</button>                           
            </div>
        </div>
    )
}

export default EditPresentComponent;