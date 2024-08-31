import { useEffect, useState } from "react";
import { backendURL } from "../Globals";
import { useNavigate } from "react-router-dom";
import { Button, Table } from "antd";

let FriendsComponents = (props) => {
    let {createNotificacion,setLogin} = props
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
            setLogin(false)
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
    let columns = [
        {
            title: "Friend name",
            dataIndex: "emailFriend"
        },
        {   
            dataIndex: "emailFriend",
            render: (emailFriend) => <Button title="Delete" onClick={() => onClickDelete(emailFriend)}>Delete</Button>
        }
    
    ]
    
    return (
        <Table columns={columns} dataSource={friends} />

    );
};

export default FriendsComponents;
