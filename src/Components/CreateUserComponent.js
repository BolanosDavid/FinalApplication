import { useState } from 'react';
import { backendURL } from '../Globals';
import { useNavigate } from 'react-router-dom';
let CreateUserComponent = () =>  {
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
            let jsonData = await response.json()
            navigate("/login")
        }else{
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
        
    }
    
    return(
        <>
            <h2>Register</h2>
            <h3>{ message }</h3>
            <div className="center-box">
                <div className="from-group">
                    <input type="text" placeholder="Email:" onChange={changeEmail }/>
                </div>
                <div className="from-group">
                    <input type="password" placeholder="Password:" onChange={changePassword }/>
                </div>
                <button onClick={onClickCreate}>Create Account</button>
            </div>
        </>
    )

}


export default CreateUserComponent