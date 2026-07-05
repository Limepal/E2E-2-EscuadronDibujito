import { useEffect, useState,type ReactNode } from 'react'
import type { User, UserCredentials, UserRegister } from '../types/type'
import api from '../api/axios';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import * as authService from '../services/AuthService'

function AuthContextProvider({children}:{children:ReactNode}) {
    const [user,setUser] = useState<User | null>(null);
    const [token, setToken]=useState(
        localStorage.getItem('token') || ''
    );
    const [error, setError] = useState('');
    const [loading, setLoadin] = useState(false);

    useEffect(()=>{
        setLoadin(true)
        const getUser = async () =>{
            if(!token){
                setLoadin(false)
                return
            }
            try {
                const res = await api.get('/user/me');
                setUser(res.data);
            } catch(error){
                console.log(error);
                localStorage.removeItem('token');
                setToken('');
                setUser(null);
            }finally{
            setLoadin(false)
        }
        } 
        getUser();
    },[token])

const login = async (credentials: UserCredentials) => {
    try {
        const response = await authService.login(credentials);

        localStorage.setItem("token", response);
        setToken(response);
        setError('');
        
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            if (status === 401) {
                setError("Correo o contraseña incorrectos.");
            } else if (status === 404) {
                setError("Correo no existe.");
            } else {
                setError("Ocurrió un error inesperado.");
            }
        } else {
            setError("Error desconocido.");
        }
    }
};
const register = async (register: UserRegister) => {
    const response = await authService.register(register);
    localStorage.setItem("token", response);
    setToken(response);
};
  return (
    <AuthContext.Provider value={{user,login,token,error, register, loading}} >
        {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
