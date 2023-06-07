import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginScreen from './pages/LoginScreen';
import HomeScreen from './pages/HomeScreen';
import EditProfileScreen from './pages/EditProfileScreen';
import GameScreen from './pages/GameScreen';
import GameHistoryCmp from './pages/GameHistoryScreen';
import axios from 'axios';
import TwoFactorAuthScreen from './pages/TwoFactorAuthScreen';
import PageNotFoundCmp from './componets/PageNotFoundCmp';

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
          <Route path='/2fa' element={<TwoFactorAuthScreen/>}/>
          <Route path='/home' element={<HomeScreen/>}/>
          <Route path='/editprofile' element={<EditProfileScreen/>}/>
          <Route path='/game' element={<GameScreen/>}/>
          <Route path='/history' element={<GameHistoryCmp/>}/> 
          <Route path='*'element={<PageNotFoundCmp/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;