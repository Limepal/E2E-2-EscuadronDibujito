import api from "../api/axios";
import type { UserCredentials, UserRegister } from "../types/type";

export const login = async (data:UserCredentials): Promise<string> => {
    const res = await api.post('/auth/login', data)
    return res.data;
}

export const register = async (data:UserRegister): Promise<string> =>{
    const res = await api.post('/auth/login', data);
    return res.data;
}
