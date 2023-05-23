import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginScreen from './pages/LoginScreen';
import HomeScreen from './pages/HomeScreen';
import EditProfileScreen from './pages/EditProfileScreen';
import GameScreen from './pages/GameScreen';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginScreen/>}/>
          <Route path='/home/:intraID' element={<HomeScreen/>}/>
          <Route path='/editprofile/:intraID' element={<EditProfileScreen/>}/>
          <Route path='/matchroom/:matchID' element={<GameScreen/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;