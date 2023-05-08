import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginScreen from './pages/LoginScreen';
import HomeScreen from './pages/HomeScreen';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginScreen/>}/>
          <Route path='/home' element={<HomeScreen/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;