import './App.css';
import { Route, Routes, Link, useNavigate} from 'react-router-dom'

import CreateUserComponent from './Components/CreateUserComponent';
import LoginUserComponent from './Components/LoginUserComponent';
import PresentUserComponent from './Components/PresentComponent';
import CreatePresentComponent from './Components/CreatePresentComponent';
import EditPresentComponent from './Components/EditPresentComponent';
import { useEffect, useState } from 'react';
import { backendURL } from './Globals';
import FriendsComponents from './Components/FriendsComponent';
import FriendsPresentsComponent from './Components/FriendsPresentsComponent';
import AddFriendsComponent from './Components/AddFriendsComponent';
function App() {
  let [notificacion,setNotificacion] = useState("")
  let [login,setLogin] = useState(false)
  let navigate = useNavigate()  
  let createNotificacion = (msg) => {
    setNotificacion(msg)
    setTimeout(() => {
      setNotificacion("")
    },3500)

  }
 useEffect( () => {
      if(localStorage.getItem("apiKey") !== null){
        setLogin(true)
      }else{
        setLogin(false)
      }
 },[])
let disconnect =async  () => {
  await fetch(backendURL+"/disconnect?apikey="+localStorage.getItem("apiKey"))
  localStorage.removeItem("apiKey")
  setLogin(false)
  navigate("/login")
}

  return (
    <div className='main-container'>
        <nav>
          <ul className='navbar'>
            {!login && <li><Link to= "/"> Index</Link></li>}
            { !login && <li><Link to= "/register"> Register</Link></li>}
            { !login && <li><Link to= "/login"> Login</Link></li>}
            {login && <li><Link to= "#" onClick={disconnect}> Disconnect</Link></li>}
            { login && <li><Link to= "/presents"> Presents</Link></li>}
            {login && <li><Link to= "/createPresents"> Create present</Link></li>}
            {login && <li><Link to= "/friends"> Friends</Link></li>}
            {login && <li><Link to= "/addFriends"> Add friends</Link></li>}
          </ul>
        </nav>

      { notificacion !== "" && (
        <div className='notification'>
          {notificacion}
          <span className='close-btn' onClick={() => setNotificacion("")}>X</span>
        </div>
      )}
      <Routes>
        <Route path='/' element={
          <p>Hi</p>
        }    />


      <Route path='/register' element={
          <CreateUserComponent createNotificacion={createNotificacion}   />
        }    />


      <Route path='/login' element={
          <LoginUserComponent createNotificacion={createNotificacion} setLogin={setLogin}/>
        }    />
      <Route path='/presents' element={
          <PresentUserComponent createNotificacion={createNotificacion}/>
        }    />
      <Route path='/createPresents' element={
          <CreatePresentComponent createNotificacion={createNotificacion} />
        }/>
        <Route path='/friends' element={
          <FriendsComponents createNotificacion={createNotificacion} />
        }/>
        <Route path='/addFriends' element={
          <AddFriendsComponent createNotificacion={createNotificacion} />
        }/>
      <Route path='/edit/:presentId' element={
          <EditPresentComponent createNotificacion={createNotificacion} />
        }/>  
      <Route path='/friends/:emailFriend/presents' element={
          <FriendsPresentsComponent createNotificacion={createNotificacion} />
        }/>
      
        
      </Routes>
        
    </div>
  );
}

export default App;
