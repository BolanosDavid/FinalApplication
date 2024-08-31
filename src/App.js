import 'antd/dist/reset.css'
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
import AccesToFriendsPresentsComponent from './Components/AccesToFriendsPresentsComponent';
import { Layout, Menu, notification } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';

function App() {
  let [api,contextHolder] = notification.useNotification()
  let [login,setLogin] = useState(false)
  let navigate = useNavigate()  
  let createNotificacion = (msg,type="info",placement="top") => {
    api[type]({
      message: msg,
      description: msg,
      placement: placement
    })

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
    <>
    {contextHolder}
    <Layout className='layout' style={{minHeight: "100vh"}}> 
      <Header>
        {!login && (
          <Menu theme="dark" mode='horizontal' items={[
            {key:"menuRegister", label:<Link to= "/register"> Register</Link>},
            {key:"menuLogin", label:<Link to= "/login"> Login</Link>}
          ]}>

          </Menu>
        )}
        {login && (
          <Menu theme="dark" mode='horizontal' items={[
            {key:"menuDisconnect", label:<Link to= "#" onClick={disconnect}> Disconnect</Link>},
            {key:"menuPresents", label:<Link to= "/presents"> Presents</Link>},
            {key:"menuCreatePresent", label:<Link to= "/createPresents"> Create present</Link>},
            {key:"menuFriends", label:<Link to= "/friends"> Friends</Link>},
            {key:"menuAddFriends", label:<Link to= "/addFriends"> Add friends</Link>},
            {key:"menuSearchFriends", label:<Link to= "/searchFriendPresents"> Search friends presents</Link>}
          ]}></Menu>
        )}
        
      </Header>
    <Content style={{padding: '20px 50px'}}> 
      <Routes>
      <Route path='/register' element={
          <CreateUserComponent createNotificacion={createNotificacion}   />
        }    />
      <Route path='/login' element={
          <LoginUserComponent createNotificacion={createNotificacion} setLogin={setLogin}/>
        }    />
      <Route path='/presents' element={
          <PresentUserComponent createNotificacion={createNotificacion} setLogin={setLogin}/>
        }    />
      <Route path='/createPresents' element={
          <CreatePresentComponent createNotificacion={createNotificacion} setLogin={setLogin}/>
        }/>
        <Route path='/friends' element={
          <FriendsComponents createNotificacion={createNotificacion}setLogin={setLogin} />
        }/>
        <Route path='/addFriends' element={
          <AddFriendsComponent createNotificacion={createNotificacion}setLogin={setLogin} />
        }/>
      <Route path='/edit/:presentId' element={
          <EditPresentComponent createNotificacion={createNotificacion} setLogin={setLogin}/>
        }/>  
        <Route path='/searchFriendPresents' element={
          <AccesToFriendsPresentsComponent createNotificacion={createNotificacion} setLogin={setLogin}  />
        }/>
      <Route path='/friends/:emailFriend/presents' element={
          <FriendsPresentsComponent createNotificacion={createNotificacion} setLogin={setLogin} />
        }/>
      
        
      </Routes>
      </Content>
    <Footer style={{textAlign:'center'}}>
        my website
    </Footer>  
    </Layout>
    </>
  );
 

}

export default App;
