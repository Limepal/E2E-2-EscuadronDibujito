import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { getMyTrips } from '../services/passengerService'
import type { Trip } from '../types'
import StatusBadge from '../statusBadge'

function PassengerDashboardPage() {
  const { user, token, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token || authLoading) return
    if (!user) return

    const load = async () => {
      try {
        const data = await getMyTrips()
        setTrips(data)
      } catch {
        setError('Error al cargar los viajes')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token, authLoading, user])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login', { replace: true })
  }

  if (authLoading) {
    return <div className="p-8 text-center text-slate-500">Cargando...</div>
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Hola, {user?.firstName} 👋
          </h1>
          <p className="text-slate-500 text-sm">Pasajero</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/passenger/history')}
            className="text-sm text-slate-500 hover:text-slate-800 underline"
          >
            Historial
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-slate-800 underline"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>
      )}

      <button
        onClick={() => navigate('/passenger/request-trip')}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl mb-8 transition"
      >
        Solicitar un viaje
      </button>

      <div>
        <h2 className="font-semibold text-slate-800 mb-3">Mis viajes</h2>
        {loading ? (
          <p className="text-sm text-slate-500">Cargando viajes...</p>
        ) : trips.length === 0 ? (
          <p className="text-sm text-slate-500">No tienes viajes aún.</p>
        ) : (
          <div className="space-y-3">
            {trips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => navigate(`/passenger/trips/${trip.id}`)}
                className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 font-medium truncate">
                    {trip.pickupAddress} → {trip.dropoffAddress}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(trip.requestedAt).toLocaleString()}
                  </p>
                </div>
                <StatusBadge status={trip.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PassengerDashboardPage
