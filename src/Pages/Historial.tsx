import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { getMyTrips as getPassengerTrips } from '../services/passengerService'
import { getMyTrips as getDriverTrips } from '../services/driverService'
import type { Trip, TripStatus } from '../types'
import StatusBadge from '../statusBadge'

const ALL_STATUS = 'ALL' as const
const STATUS_OPTIONS = [ALL_STATUS, 'PENDING', 'IN_PROGRESS', 'COMPLETED'] as const

type FilterStatus = TripStatus | typeof ALL_STATUS

function getStatusLabel(status: FilterStatus) {
  if (status === ALL_STATUS) return 'Todos'
  if (status === 'PENDING') return 'Pendientes'
  if (status === 'IN_PROGRESS') return 'En curso'
  return 'Completados'
}

function formatDate(date: string) {
  return new Date(date).toLocaleString()
}

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

  const filtered = filter === ALL_STATUS ? trips : trips.filter((trip) => trip.status === filter)
  const getBackPath = () => (user?.role === 'DRIVER' ? '/driver' : '/passenger')

  if (authLoading) {
    return <div className="p-8 text-center text-slate-500">Cargando...</div>
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <button
        onClick={() => navigate(getBackPath())}
        className="mb-4 text-sm text-slate-500 underline hover:text-slate-800"
      >
        Volver
      </button>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Historial de viajes</h1>
          <p className="mt-1 text-sm text-slate-500">
            Revisa tus viajes y filtra por estado.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                filter === status
                  ? 'bg-gray-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {getStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Cargando historial...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-slate-500">No hay viajes que coincidan con el filtro.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Origen</th>
                <th className="px-4 py-3 font-semibold">Destino</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">
                  {user?.role === 'DRIVER' ? 'Pasajero' : 'Conductor'}
                </th>
                <th className="px-4 py-3 text-right font-semibold">Accion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((trip) => {
                const participant =
                  user?.role === 'DRIVER'
                    ? `${trip.passenger.firstName} ${trip.passenger.lastName}`
                    : trip.driver
                      ? `${trip.driver.firstName} ${trip.driver.lastName}`
                      : 'Sin asignar'

                return (
                  <tr
                    key={trip.id}
                    onClick={() => navigate(`${getBackPath()}/trips/${trip.id}`)}
                    className="cursor-pointer transition hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                      {formatDate(trip.requestedAt)}
                    </td>
                    <td className="max-w-[190px] px-4 py-4 text-sm font-medium text-slate-800">
                      <span className="block truncate">{trip.pickupAddress}</span>
                    </td>
                    <td className="max-w-[190px] px-4 py-4 text-sm text-slate-700">
                      <span className="block truncate">{trip.dropoffAddress}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <StatusBadge status={trip.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                      {participant}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          navigate(`${getBackPath()}/trips/${trip.id}`)
                        }}
                        className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-gray-800"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Historial
