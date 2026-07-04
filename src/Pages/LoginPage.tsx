import { useState } from 'react';
import { login } from '../services/authService';

interface Props {
  onLoginSuccess: () => void;
}

// Login simple, solo para obtener el token del conductor.
// (El punto 1 del sistema de calificación no se implementa aquí a propósito,
// esta pantalla solo existe para poder probar los puntos 5 y 6).
export default function Login({ onLoginSuccess }: Props) {
  const [email, setEmail] = useState('carlos@uber.com');
  const [password, setPassword] = useState('pass123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Ingreso conductor</h1>
        <p className="text-sm text-slate-500 mb-6">
          Usa una cuenta de conductor de prueba (ej. carlos@uber.com / pass123)
        </p>

        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
        />

        <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
        />

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-2 rounded-lg transition"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
