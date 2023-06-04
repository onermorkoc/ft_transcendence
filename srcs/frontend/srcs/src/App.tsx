import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginScreen from './pages/LoginScreen';
import HomeScreen from './pages/HomeScreen';
import EditProfileScreen from './pages/EditProfileScreen';
import GameScreen from './pages/GameScreen';
import GameHistoryCmp from './pages/GameHistoryScreen';
import axios from 'axios';

function App() {

  axios.interceptors.request.use(config => {
    config.withCredentials = true
    return (config)
  })

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginScreen/>}/>
          <Route path='/home' element={<HomeScreen/>}/>
          <Route path='/editprofile' element={<EditProfileScreen/>}/>
          <Route path='/matchroom/:matchID' element={<GameScreen/>}/>
          <Route path='/history' element={<GameHistoryCmp/>}/> 
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;