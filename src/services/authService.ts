import api from "../api/axios";
import type { UserCredentials, UserRegister } from "../types/type";

export const login = async (data:UserCredentials): Promise<string> => {
    const res = await api.post<{token: string}>('/auth/login', data)
    return res.data.token;
}

export const register = async (data:UserRegister): Promise<string> =>{
    const res = await api.post<{token: string}>('/auth/register', data);
    return res.data.token;
}
