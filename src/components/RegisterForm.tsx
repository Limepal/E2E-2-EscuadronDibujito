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
    <div>
      <form onSubmit={handleSubmit}>
        <input name='firstName' placeholder='firstName' onChange={handleChange} value={form.firstName}></input>
        <input name='lastName' placeholder='lastName' onChange={handleChange} value={form.lastName}></input>
        <input name='email' placeholder='email' onChange={handleChange} value={form.email}></input>
        <input name='password' placeholder='password' onChange={handleChange} value={form.password}></input>
        <select name='role' onChange={handleChange} value={form.role}>
          <option value='PASSENGER'>PASSENGER</option>
          <option value='DRIVER'>DRIVER</option>
        </select>
        {error && <span>{error}</span>}
        {success && <span>{success}</span>}
        <button type='submit'>Registrarse</button>
      </form>
    </div>
  )
}

export default RegisterForm
