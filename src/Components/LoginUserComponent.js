import { useState } from 'react';
import { backendURL } from '../Globals';
import { useNavigate } from 'react-router-dom';
import { Button,Card, Input, Typography } from 'antd';
let LoginUserComponent = (props ) =>  {
    let {createNotificacion, setLogin} = props
    let [ email, setEmail ] = useState("");
    let [ password, setPassword ] = useState("");
    let [ message, setMessage ] = useState("");
    let navigate = useNavigate()
    let changeEmail = (e) => {
        setEmail(e.currentTarget.value)
    }
    let changePassword = (e) => {
        setPassword(e.currentTarget.value)
    } 
    let onClickLogin = async () => {
        let response = await fetch(backendURL+"/users/login", { 
            method:'POST',
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({
                email: email,
                password: password
                }) 
        }) 
        if (response.ok){
            let jsonData = await response.json()
            localStorage.setItem("apiKey", jsonData.apiKey)
            localStorage.setItem("email", jsonData.email)
            localStorage.setItem("id", jsonData.id)
            createNotificacion("Loged in")
            setLogin(true)
            navigate("/presents/")
        }else{
            let jsonData = await response.json()
            if(Array.isArray(jsonData.error)){
                let finalErrorMessage = ""
                jsonData.error.forEach(element => {
                    finalErrorMessage += element.error+ " "
                });
                setMessage(finalErrorMessage)
                
            }else{
                setMessage(jsonData.error)
            }
            
        }
        
    }
    
    return(
        <Card title="Login" style={{minWidth: '300px', maxWidth:'500px', textAlign:'center'}}>
            { message != "" && <Typography.Text type="danger">{message}</Typography.Text>}
            <Input size='large' style={{marginBottom: '10px'}} type="text" placeholder='email' onChange={changeEmail } />
            <Input size='large'style={{marginBottom: '10px'}} type="password" placeholder='password' onChange={changePassword } />
            { message !== "" && <h3 className='errorMessage'>{ message } </h3> }
            <Button type="primary" shape="round" onClick={onClickLogin} block>Login</Button>
        </Card>
    )

}


export default LoginUserComponent