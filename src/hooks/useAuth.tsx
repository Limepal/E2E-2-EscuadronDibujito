import {useContext} from 'react'
import { AuthContext } from '../context/AuthContext'

export default function useAuth() {
    const context = useContext(AuthContext);
    if(context === null){
        throw new Error(
            "useAuth debe usarse de AuthProvider"
        );
    }
  return (
    context
  )
}
