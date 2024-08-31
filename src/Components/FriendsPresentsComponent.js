import { useEffect, useState } from "react";
import { backendURL } from "../Globals";
import { useNavigate, useParams,Link } from "react-router-dom";
let FriendsPresentsComponent =  (props) =>{
    let {createNotificacion,setLogin} = props
    let [message, setMessage] = useState("");
    let [friendPresents, setFriendPresents] = useState([]); 
    let { emailFriend } = useParams()
    let navigate  = useNavigate()
    useEffect(() => {
        getFriendsPresents();
    }, []);
    let getFriendsPresents = async () => {
        let response = await fetch(backendURL + "/presents?email=" + emailFriend + "&apiKey=" + localStorage.getItem("apiKey"));
        if(response.status === 401){
            navigate("/login")
            createNotificacion("You need to be loged in")
            setLogin(false)
            return
        }
        if (response.ok) {
            let jsonData = await response.json(); 
            setFriendPresents(jsonData); 
            setMessage("");
        } else {
            let jsonData = await response.json()
            setMessage(jsonData.error);
        }
    };

    let onClickRegalar = async (friendPresent) => {

        let response = await fetch(backendURL+"/presents/"+friendPresent.id+"?apiKey="+localStorage.getItem("apiKey"), { 
            method:'PUT',
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({friendPresent})
        }) 
        if (response.ok){
            createNotificacion("Present chosen succesfully")
            navigate("/friends/")
        
        }else{
            let jsonData = await response.json()
            setMessage(jsonData)
        }
    }
    
    return(
        <div>
        <h2> {emailFriend} presents </h2>
        {message !== "" && <h3 className="errorMessage"> {message}</h3>}
        <div>
            {friendPresents.map(friendPresent => (
                <div className="item" key={friendPresent.id}> 
                    <p className="name"> {friendPresent.name} </p>
                    <p className="description"> {friendPresent.description} </p>
                    <Link to={friendPresent.url} >{friendPresent.url}</Link>
                    <p className="price"> {friendPresent.price}€ </p>
                    <p> {friendPresent.chosenBy} </p>
                    <button onClick={() => onClickRegalar(friendPresent)}>Regalar</button>
                </div>
            ))}
        </div>
    </div>
    )
}


export default FriendsPresentsComponent