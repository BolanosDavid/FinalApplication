import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backendURL } from "../Globals";
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
        <div>
            <h2> Friends </h2>
            {message !== "" && <h3 className="errorMessage"> {message}</h3>}
            <div>
                <div className="item"> 
                    <input type="text"placeholder="Friends email?" onChange={changeEmail} /> 
                    <button onClick={() => onClickBuscar()}> Buscar</button>
                </div>
                
            </div>
        </div>
    );
}
export default AccesToFriendsPresentsComponent