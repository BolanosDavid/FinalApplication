import { useEffect, useState } from "react";
import { backendURL } from "../Globals";
import { useNavigate,Link } from "react-router-dom";

let FriendsComponents = (props) => {
    let {createNotificacion} = props
    let [message, setMessage] = useState("");
    let [friends, setFriends] = useState([]); 
    let navigate  = useNavigate()
    useEffect(() => {
        getFriends();
    }, []);

    let getFriends = async () => {
        let response = await fetch(backendURL + "/friends?apiKey=" + localStorage.getItem("apiKey"));
        if(response.status === 401){
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
    let onClickDelete =  async (emailFriend) => {
        let response = await fetch(backendURL + "/friends/"+emailFriend+"?apiKey=" + localStorage.getItem("apiKey"), {
            method: "DELETE"
        })
        if (response.ok){
            let newFriends = friends.filter( friend => friend.emailFriend !== emailFriend)
            createNotificacion("Friend deleted")
            setFriends(newFriends)
        }else{
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }

    return (
        <div>
            <h2> Friends </h2>
            {message !== "" && <h3 className="errorMessage"> {message}</h3>}
            <div>
                {friends.map(friend => (
                    <div className="item"> 
                        <Link to={`/friends/${friend.emailFriend}/presents`}>{friend.emailFriend}</Link>
                        <button onClick={() => onClickDelete(friend.emailFriend)}> Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FriendsComponents;
