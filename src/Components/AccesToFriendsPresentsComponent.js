import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backendURL } from "../Globals";
import { Button,Card, Input } from 'antd';
let AccesToFriendsPresentsComponent = (props) => {
    let {createNotificacion, setLogin} = props
    let [email,setEmail] = useState("")
    let [message,setMessage] = useState("")
    let [friends,setFriends] = useState([])
    let navigate  = useNavigate()


    useEffect(() => {
        getFriends()
    },[])
    let onClickBuscar = () => {
        
        let isFriend =friends.find(friend => friend.emailFriend === email)
        if (isFriend != undefined){
            navigate(`/friends/${email}/presents`)
        }else{
            setMessage(`${email} dont have you in friend list`)
        }
        
    }
    let changeEmail = (e) => {
        setEmail(e.currentTarget.value)
    }
    let getFriends = async () => {
        let response = await fetch(backendURL + "/friends?apiKey=" + localStorage.getItem("apiKey"));
        if(response.status === 401){
            setLogin(false)
            navigate("/login")

            createNotificacion("You need to be loged in")
            return
        }
        if (response.ok) {
            let jsonData = await response.json(); 
            setFriends(jsonData); 
            setMessage("");
        } else {
            let jsonData = await response.json()
            setMessage(jsonData.error);
        }
    };

    return (
        <Card title="Friends presents" style={{minWidth: '300px', maxWidth:'500px', textAlign:'center'}}>
        <Input size='large' style={{marginBottom: '10px'}} type="text" placeholder='friends email?' onChange={changeEmail } />
        <Button type="primary" shape="round" onClick={() => onClickBuscar()} block>Buscar</Button>
        </Card>
            
    );
}
export default AccesToFriendsPresentsComponent