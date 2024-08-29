import { useState } from 'react';
    import { backendURL } from '../Globals';
import { useNavigate } from 'react-router-dom';
let CreateUserComponent = () => {
        let [ item,setItem] = useState({});
        let [ message, setMessage ] = useState("");
        let navigate = useNavigate()
        let changeProperty = (propertyName, e) => {
            let newItem = {...item, [propertyName] : e.currentTarget.value }

            setItem(newItem)
        } 
        let onClickCreate = async () => {
            let response = await fetch(backendURL+"/presents?apiKey="+localStorage.getItem("apiKey"), { 
                method:'POST',
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify(item) 
            }) 
            if (response.ok){
                let jsonData = await response.json()
                navigate("/presents/")
            }else{
                let jsonData = await response.json()
                setMessage(jsonData.error)
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
                    <div className="from-group">
                        <input type="text" placeholder="description:" onChange={e => changeProperty("description",e) }/>
                    </div>
                    <div className="from-group">
                        <input type="text" placeholder="url:" onChange={e => changeProperty("url",e) }/>
                    </div>

                    <div className="from-group">
                        <input type="number" placeholder="price:" onChange={e => changeProperty("price",e) }/>
                    </div>

                    <button onClick={onClickCreate}>Create Present</button>
                </div>
            </>
        )
    
    }
    
    


export default CreateUserComponent