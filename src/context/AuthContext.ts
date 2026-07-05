import { createContext } from "react"
import type { User, UserCredentials, UserRegister } from "../types/type"

type AuthContextType = {
    error: string,
    user: User | null;
    token: string;
    login: (credentials: UserCredentials) => Promise<void>;
    register:(register: UserRegister) => Promise<void>;
    loading: boolean;
}


export const AuthContext = createContext<AuthContextType | null>(null);