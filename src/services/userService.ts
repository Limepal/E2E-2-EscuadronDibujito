import api from '../api/axios'
import type { User } from '../types/index';

export const getMe = async (): Promise<User> => {
    const {data} = await api.get<User>('/users/me')
    return data
}
