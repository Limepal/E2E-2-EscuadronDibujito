import React, { useState, type FormEvent } from 'react'
import useAuth from '../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import type { UserRegister } from '../types/type'

function RegisterForm() {
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<UserRegister>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'PASSENGER',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.role) {
      setError('Todos los campos son obligatorios')
      return
    }

    try {
      await register(form)
      navigate('/')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    }
  }

  return (
    <div className='w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
      <h1 className='mb-6 text-center text-2xl font-semibold text-gray-900'>Crear cuenta</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <input className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900' name='firstName' placeholder='Nombre' onChange={handleChange} value={form.firstName}></input>
        <input className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900' name='lastName' placeholder='Apellido' onChange={handleChange} value={form.lastName}></input>
        <input className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900' name='email' placeholder='Email' onChange={handleChange} value={form.email}></input>
        <input className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900' name='password' placeholder='Contraseña' type='password' onChange={handleChange} value={form.password}></input>
        <select className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900' name='role' onChange={handleChange} value={form.role}>
          <option value='PASSENGER'>PASSENGER</option>
          <option value='DRIVER'>DRIVER</option>
        </select>
        {error && <span className='block text-sm text-red-600'>{error}</span>}
        <button className='w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800' type='submit'>Registrarse</button>
      </form>
      <p className='mt-4 text-center text-sm text-gray-500'>
        ¿Ya tienes cuenta?{' '}
        <Link to='/login' className='font-medium text-gray-900 hover:underline'>Inicia sesión</Link>
      </p>
    </div>
  )
}

export default RegisterForm
