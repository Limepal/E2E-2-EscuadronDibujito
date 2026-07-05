import React, { useState, type FormEvent } from 'react'
import { type UserCredentials } from '../types/type'
import useAuth from '../hooks/useAuth';
import { useNavigate } from "react-router-dom";

function LoginForm() {
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('');
    const {login} = useAuth();
    const navigate = useNavigate();
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
      setSuccess('Registro exitoso. Redirigiendo...')
      navigate('/')
    } catch (err) {
      if(err instanceof Error){
        setError(err.message)
      }
    }

    }
  return (
    <div className='w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <h1 className='mb-6 text-center text-2xl font-semibold text-gray-900'>Iniciar sesion</h1>
        <form onSubmit={hanldeSubmit} className='space-y-4'>
            <input className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900' name='email' placeholder='email' onChange={handleChange} value={form.email}></input>
            <input className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900' name='password' placeholder='password' type='password' onChange={handleChange} value={form.password}></input>
            {error && <span className='block text-sm text-red-600'>{error}</span>}
            {success && <span className='block text-sm text-green-600'>{success}</span>}
            <button className='w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800' type='submit'>Ingresar</button>
        </form>
    </div>
  )
}

export default LoginForm
