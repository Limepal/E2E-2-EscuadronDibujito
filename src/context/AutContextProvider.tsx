import { useEffect, useState,type ReactNode } from 'react'
import type { User, UserCredentials, UserRegister } from '../types/type'
import api from '../api/axios';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import * as authService from '../services/authService'

function AuthContextProvider({children}:{children:ReactNode}) {
    const [user,setUser] = useState<User | null>(null);
    const [token, setToken]=useState(
        localStorage.getItem('token') || ''
    );
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        setLoading(true)
        const getUser = async () =>{
            if(!token){
                setLoading(false)
                return
            }
            try {
                const res = await api.get('/users/me');
                setUser(res.data);
            } catch(error){
                console.log(error);
                localStorage.removeItem('token');
                setToken('');
                setUser(null);
            }finally{
            setLoading(false)
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
        let msg = "Ocurrió un error inesperado.";
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            if (status === 401) {
                msg = "Correo o contraseña incorrectos.";
            } else if (status === 404) {
                msg = "Correo no existe.";
            }
        }
        setError(msg);
        throw new Error(msg);
    }
};
const register = async (register: UserRegister) => {
    try {
        const response = await authService.register(register);
        localStorage.setItem("token", response);
        setToken(response);
        setError('');
    } catch (error) {
        let msg = "Error al registrarse.";
        if (axios.isAxiosError(error) && error.response?.data?.error) {
            msg = error.response.data.error;
        }
        setError(msg);
        throw new Error(msg);
    }
};
  return (
    <AuthContext.Provider value={{user,login,token,error, register, loading}} >
        {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
