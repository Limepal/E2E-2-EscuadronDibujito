import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import AuthContextProvider from './context/AutContextProvider'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { login } from './services/AuthService'
import ProtectedRoute from './routes/ProtectedRoute'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthContextProvider>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
        {/*Aca se pone el dashboad di tenemos y dentro las demas paginas */}
        </Route>
      </Routes>



      </BrowserRouter>
    </AuthContextProvider>
  )
}

export default App
