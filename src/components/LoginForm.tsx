import React, { useState, type FormEvent } from 'react'
import { type UserCredentials } from '../types/type'
import useAuth from '../hooks/useAuth';

function LoginForm() {
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('');
    const {login} = useAuth();
    const [form, setForm] = useState<UserCredentials>(
        {email:'',
        password:'',}
        )
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm((prev)=>({
            ...prev, [name]:value
        }))
    }
    const hanldeSubmit = async (e:FormEvent) => {
        e.preventDefault();
        setError('');
    if (!form.email || !form.password) {
      setError('Todos los campos son obligatorios')
      return
    }
    try {
      await login(form)
      setSuccess('Registro exitoso. Redirigiendo al login...')
    } catch (err) {
      if(err instanceof Error){
        setError(err.message)
      }
    }

    }
  return (
    <div>
        <form onSubmit={hanldeSubmit}>
            <input name='email' placeholder='email' onChange={handleChange} value={form.email}></input>
            <input name='password' placeholder='password' onChange={handleChange} value={form.password}></input>
            {error && <span>{error}</span>}
        </form>
    </div>
  )
}

export default LoginForm