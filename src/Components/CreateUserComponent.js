import { useEffect, useState } from 'react';
import { backendURL } from '../Globals';
import { useNavigate } from 'react-router-dom';
import { Alert, Button,Card, Input, Typography } from 'antd';
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
            createNotificacion("User created succesfully, please log in")
            navigate("/login")
        }else{
            setMessage("Error")
        }
        
    }
    
    return(
        <>
         <Card title="Register" style={{width:'500px', textAlign:'center'}}>
            {message != "" && <Alert message = {message} type="error"/>}
            <Input size='large' style={{marginBottom: '10px'}} type="text" placeholder='email' onChange={changeEmail } />
            { error.email && <Typography.Text type='danger'>{error.email} </Typography.Text>}
            <Input size='large'style={{marginTop: '10px'}} type="password" placeholder='password' onChange={changePassword } />
            { error.password && <Typography.Text type='danger' >{error.password} </Typography.Text>}
            
            <Button type="primary" shape="round" onClick={onClickCreate} block>Register</Button>
        </Card>
            
        </>
    )

}


export default CreateUserComponent