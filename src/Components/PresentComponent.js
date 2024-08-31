import { useEffect, useState } from "react"
import { backendURL } from "../Globals"
import { useNavigate, Link } from "react-router-dom"
import { Button,Card, Descriptions, List } from "antd"

let PresentUserComponent  = (props) => {
    let {createNotificacion, setLogin} = props
    let [presents, setPresents] = useState([])
    let [message, setMessage] = useState("")
    let navigate = useNavigate()
    useEffect(() => {
        getPresents()
    }, [])

    let getPresents = async () => {
        let response = await fetch(backendURL + "/presents?apiKey=" + localStorage.getItem("apiKey"))
        if(response.status === 401){
            navigate("/login")
            setLogin(false)
            createNotificacion("You need to be loged in")
            return
        }
        if (response.ok) {
            let jsonData = await response.json()
            setPresents(jsonData)
        } else {
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }
    let deletePresent =  async (id) => {
        let response = await fetch(backendURL + "/presents/"+id+"?apiKey=" + localStorage.getItem("apiKey"), {
            method: "DELETE"
        })
        if (response.ok){
            let newPresents = presents.filter( present => present.id !== id)
            createNotificacion("Present deleted")
            setPresents(newPresents)
        }else{
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }

    let editPresent = (presentId) => {
        navigate("/edit/"+presentId)
    }
    
    return (
        <>
            <Card title="Tus regalos"> </Card>
            <List
                grid={{
                    gutter: 10,
                    xs:1,
                    md:2,
                    xl:4
                }}
                dataSource={presents}
                renderItem={(present) => (
                    <List.Item>
                        <Card hoverable title={present.name} style={{width:"300px"}}>
                            <p>Description: {present.description}</p>
                            <p>
                                URL: <Link to={present.url}>{present.url}</Link>
                            </p>
                            <p>Price: {present.price}€</p>
                            <p>Chosen by: {present.chosenBy}</p>
                            <Button type="primary" shape="round" onClick={() => deletePresent(present.id)} block>Delete</Button>
                            <Button style={{ marginTop: '5px' }}type="primary" shape="round" onClick={() => editPresent(present.id)} block>Edit</Button>
                        </Card>
                    </List.Item>
                )}
            />

        </>
    );
};

export default PresentUserComponent;
