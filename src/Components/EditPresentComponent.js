import { useEffect, useState } from "react";
import { backendURL } from "../Globals";
import { useNavigate, useParams } from "react-router-dom";
import { Button,Card, Input,Alert } from "antd"
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
        <Card title= {` Edit Present: ${present.name}`} style={{minWidth: '300px', maxWidth:'500px', textAlign:'center'}}>
             {message != "" && <Alert message = {message} type="error"/>}
            <Input size='large' style={{marginBottom: '10px'}} type="text" placeholder='name' value={present.name} onChange={e =>  changeProperty("name",e)} />
            <Input size='large'style={{marginBottom: '10px'}} type="text" placeholder='description' value={present.description} onChange={e =>  changeProperty("description",e)} />
            <Input size='large' style={{marginBottom: '10px'}} type="text" placeholder='url' value={present.url} onChange={e =>  changeProperty("url",e)} />
            <Input size='large'style={{marginBottom: '10px'}} type="text" placeholder='price' value={present.price} onChange={e =>  changeProperty("price",e)} />
            <Button type="primary" shape="round" onClick={onClickEdit} block>Edit</Button>
        </Card>
        
    
)
   
}

export default EditPresentComponent;