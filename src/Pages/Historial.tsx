import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { getMyTrips as getPassengerTrips } from '../services/passengerService'
import { getMyTrips as getDriverTrips } from '../services/driverService'
import type { Trip, TripStatus } from '../types'
import StatusBadge from '../statusBadge'

const ALL_STATUS = 'ALL' as const
type FilterStatus = TripStatus | typeof ALL_STATUS

function Historial() {
  const { user, token, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<FilterStatus>(ALL_STATUS)

  useEffect(() => {
    if (!token || authLoading) return
    if (!user) return

    const load = async () => {
      try {
        const data = user.role === 'DRIVER' ? await getDriverTrips() : await getPassengerTrips()
        setTrips(data)
      } catch {
        setError('Error al cargar el historial')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token, authLoading, user])

  const filtered = filter === ALL_STATUS ? trips : trips.filter((t) => t.status === filter)

  const getBackPath = () => (user?.role === 'DRIVER' ? '/driver' : '/passenger')

  if (authLoading) {
    return <div className="p-8 text-center text-slate-500">Cargando...</div>
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => navigate(getBackPath())}
        className="text-sm text-slate-500 hover:text-slate-800 mb-4 underline"
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-bold text-slate-800 mb-6">Historial de viajes</h1>

      {error && (
        <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>
      )}

      <div className="flex gap-2 mb-6">
        {([ALL_STATUS, 'PENDING', 'IN_PROGRESS', 'COMPLETED'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
              filter === s
                ? 'bg-gray-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {s === ALL_STATUS ? 'Todos' : s === 'PENDING' ? 'Pendientes' : s === 'IN_PROGRESS' ? 'En curso' : 'Completados'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Cargando historial...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-slate-500">No hay viajes que coincidan con el filtro.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((trip) => (
            <div
              key={trip.id}
              onClick={() => navigate(`${getBackPath()}/trips/${trip.id}`)}
              className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800 font-medium truncate">
                  {trip.pickupAddress} → {trip.dropoffAddress}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(trip.requestedAt).toLocaleString()}
                  {trip.driver && ` · ${trip.driver.firstName}`}
                </p>
              </div>
              <StatusBadge status={trip.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Historial
