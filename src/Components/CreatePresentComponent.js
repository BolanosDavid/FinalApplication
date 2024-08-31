import {useEffect, useState } from 'react';
    import { backendURL } from '../Globals';
import { useNavigate } from 'react-router-dom';
let CreateUserComponent = (props) => {
        let {createNotificacion,setLogin} = props
        let [ item,setItem] = useState({});
        let [ message, setMessage ] = useState("");
        let [error,setError] = useState({})
    
        useEffect(() => {
            checkLogin()
        },[])

        let checkLogin = async () => {
            let response = await fetch(backendURL + "/presents?apiKey=" + localStorage.getItem("apiKey"))
            if (response.status === 401){
                setLogin(false)
                createNotificacion("You need to be loged in ")
                navigate("/login")
                return 
            }
        }
        useEffect(() => {
            checkErrors()
        },[item])
    
        let checkErrors = () => {
            let updatedErrors = {}
            
            if(item.name === "" || item.name?.length < 3 ){
                updatedErrors.name = "Name is too short"
            }
            if(item.description === "" || item.description?.length < 10 ){
                updatedErrors.description = "Description is too short"
            }


            if(item.url === "" || item.url?.length < 7 ){
                updatedErrors.url = "Not an url"
            }
            if( item.price?.length < 1||item.price < 0 ){
                updatedErrors.price = "Price can not be negative"
            }
            setError(updatedErrors)
        }
        let navigate = useNavigate()
        let changeProperty = (propertyName, e) => {
            let newItem = {...item, [propertyName] : e.currentTarget.value }

            setItem(newItem)
        } 
        let onClickCreate = async () => {
            if(Object.keys(error).length === 0){
                let response = await fetch(backendURL+"/presents?apiKey="+localStorage.getItem("apiKey"), { 
                    method:'POST',
                    headers:{"Content-Type": "application/json"},
                    body: JSON.stringify(item)}) 
                if (response.ok){
                    createNotificacion("Present was created successfully")
                    navigate("/presents/")
                }else{
                    let jsonData = await response.json()
                    setMessage(jsonData.error)
                }
            }else{
                setMessage("There are fields that need to be completed")
            }

        
        }
        
        return(
            <>
                <h2>Create new present </h2>
                { message !== "" && <h1 className='errorMessage'> {message}</h1>} 
                <div className="center-box">
                    <div className="from-group">
                        <input type="text" placeholder="name:" onChange={ e => changeProperty("name",e) }/>
                    </div>
                    { error.name && <p className='errorForm'>{error.name} </p>}
                    <div className="from-group">
                        <input type="text" placeholder="description:" onChange={e => changeProperty("description",e) }/>
                    </div>
                    { error.description && <p className='errorForm'>{error.description} </p>}
                    <div className="from-group">
                        <input type="text" placeholder="url:" onChange={e => changeProperty("url",e) }/>
                    </div>
                    { error.url && <p className='errorForm'>{error.url} </p>}
                    <div className="from-group">
                        <input type="number" placeholder="price:" onChange={e => changeProperty("price",e) }/>
                    </div>
                    { error.price && <p className='errorForm'>{error.price} </p>}
                    
                    <button onClick={onClickCreate}>Create Present</button>
                </div>
            </>
        )
    
    }
    
    


export default CreateUserComponent