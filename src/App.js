import './App.css';
import { Route, Routes, Link} from 'react-router-dom'

import CreateUserComponent from './Components/CreateUserComponent';
import LoginUserComponent from './Components/LoginUserComponent';
import PresentUserComponent from './Components/PresentComponent';
import CreatePresentComponent from './Components/CreatePresentComponent';
import EditPresentComponent from './Components/EditPresentComponent';
function App() {
  return (
    <div className='main-container'>
        <nav>
          <ul className='navbar'>
            <li><Link to= "/"> Index</Link></li>
            <li><Link to= "/register"> Register</Link></li>
            <li><Link to= "/login"> Login</Link></li>
            <li><Link to= "/presents"> Presents</Link></li>
            <li><Link to= "/createPresents"> Create present</Link></li>
          </ul>
        </nav>
      <Routes>
        <Route path='/' element={
          <p>Hi</p>
        }    />


      <Route path='/register' element={
          <CreateUserComponent   />
        }    />


      <Route path='/login' element={
          <LoginUserComponent />
        }    />
      <Route path='/presents' element={
          <PresentUserComponent />
        }    />
      <Route path='/createPresents' element={
          <CreatePresentComponent />
        }/>
      <Route path='/edit/:presentId' element={
          <EditPresentComponent />
        }/>  
      
        
      </Routes>
        
    </div>
  );
}

export default App;
