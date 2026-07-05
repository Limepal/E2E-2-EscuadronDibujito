import { useState } from 'react';
import Login from './Pages/LoginPage';
import DriverDashboard from './Pages/DriverDashboard';
import TripDetail from './Pages/TripDetail';
import './App.css'
import AuthContextProvider from './context/AutContextProvider'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { login } from './services/AuthService'
import ProtectedRoute from './routes/ProtectedRoute'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'


export default function App() {
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
