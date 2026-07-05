import './App.css'
import AuthContextProvider from './context/AutContextProvider'
import AppRouter from './AppRouter'


export default function App() {
  return (
    <AuthContextProvider>
      <AppRouter />
    </AuthContextProvider>
  )
}
