import { useEffect, useState } from "react"
import { backendURL } from "../Globals"
import { useNavigate, Link } from "react-router-dom"

let PresentUserComponent  = (props) => {
    let {createNotificacion} = props
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
        <div>
            <h2> Presents </h2>
            {message !== "" && <h3 className="errorMessage"> {message}</h3>}
            <div>
                {presents.map(present => (
                    <div className="item" key={present.id}> 
                        <p className="name"> {present.name} </p>
                        <p className="description"> {present.description} </p>
                        <Link to={present.url} >{present.url}</Link>
                        <p className="price"> {present.price}€ </p>
                        <p> {present.chosenBy} </p>
                        <button onClick={() => deletePresent(present.id)}> Delete</button>
                        <button onClick={() => {editPresent(present.id)}}> Edit</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PresentUserComponent
