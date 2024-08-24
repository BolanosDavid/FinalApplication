import './App.css';
import { Route, Routes, Link} from 'react-router-dom'

import CreateUserComponent from './Components/CreateUserComponent';
import LoginUserComponent from './Components/LoginUserComponent';
function App() {
  return (
    <div className='main-container'>
        <nav>
          <ul className='navbar'>
            <li><Link to= "/"> Index</Link></li>
            <li><Link to= "/register"> Register</Link></li>
            <li><Link to= "/login"> Login</Link></li>

          </ul>
        </nav>
      <Routes>
        <Route path='/' element={
          <p>Pi</p>
        }    />


      <Route path='/register' element={
          <CreateUserComponent   />
        }    />


      <Route path='/login' element={
          <LoginUserComponent />
        }    />
        
      </Routes>
        
    </div>
  );
}

export default App;
