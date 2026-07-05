import React, { useState, type FormEvent } from 'react'
import useAuth from '../hooks/useAuth'
import type { UserRegister } from '../types/type'

function RegisterForm() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { register } = useAuth()
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
    setSuccess('')

    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.role) {
      setError('Todos los campos son obligatorios')
      return
    }

    try {
      await register(form)
      setSuccess('Registro exitoso.')
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
        <input className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900' name='firstName' placeholder='firstName' onChange={handleChange} value={form.firstName}></input>
        <input className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900' name='lastName' placeholder='lastName' onChange={handleChange} value={form.lastName}></input>
        <input className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900' name='email' placeholder='email' onChange={handleChange} value={form.email}></input>
        <input className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900' name='password' placeholder='password' type='password' onChange={handleChange} value={form.password}></input>
        <select className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900' name='role' onChange={handleChange} value={form.role}>
          <option value='PASSENGER'>PASSENGER</option>
          <option value='DRIVER'>DRIVER</option>
        </select>
        {error && <span className='block text-sm text-red-600'>{error}</span>}
        {success && <span className='block text-sm text-green-600'>{success}</span>}
        <button className='w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800' type='submit'>Registrarse</button>
      </form>
    </div>
  )
}

export default RegisterForm
