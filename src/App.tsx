import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import AuthContextProvider from './context/AutContextProvider'
import LoginForm from './components/LoginForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthContextProvider>
      <LoginForm />
    </AuthContextProvider>
  )
}

export default App
