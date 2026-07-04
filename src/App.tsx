import { useState } from 'react';
import Login from './Pages/LoginPage';
import DriverDashboard from './Pages/DriverDashboard';
import TripDetail from './Pages/TripDetail';
import './App.css'
import AuthContextProvider from './context/AutContextProvider'
import LoginForm from './components/LoginForm'


export default function App() {
  return (
    <AuthContextProvider>
      <LoginForm />
    </AuthContextProvider>
  )
}
