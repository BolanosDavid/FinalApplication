import { useEffect, useState } from "react";
import { backendURL } from "../Globals";
import { useNavigate, useParams,Link } from "react-router-dom";
import { Button,Card, List } from 'antd';
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
        <>  
            <Card title= {`${emailFriend} presents`}> </Card>
            <List 
            
                grid={{
                    gutter: 10,
                    xs:1,
                    md:2,
                    xl:4
                }}
                dataSource={friendPresents}
                renderItem={(present) => (
                    <List.Item>
                        <Card hoverable title={present.name} style={{width:"300px"}}>
                            <p>Description: {present.description}</p>
                            <p>
                                URL: <Link to={present.url}>{present.url}</Link>
                            </p>
                            <p>Price: {present.price}€</p>
                            <p>Chosen by: {present.chosenBy}</p>
                            <Button type="primary" shape="round" onClick={() => onClickRegalar(present)} block>Regalar</Button>
                            
                        </Card>
                    </List.Item>
                )}
            />
        
        </>
    )
}


export default FriendsPresentsComponent