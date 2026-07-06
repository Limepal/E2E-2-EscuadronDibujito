import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createTrip, getAvailableDrivers } from '../services/passengerService'
import type { User } from '../types'

function RequestTripPage() {
  const navigate = useNavigate()
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [drivers, setDrivers] = useState<User[]>([])
  const [loadingDrivers, setLoadingDrivers] = useState(true)

  useEffect(() => {
    getAvailableDrivers()
      .then(setDrivers)
      .catch(() => setError('Error al cargar conductores disponibles'))
      .finally(() => setLoadingDrivers(false))
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!pickup.trim() || !dropoff.trim()) {
      setError('Ambos campos son obligatorios')
      return
    }

    setSubmitting(true)
    try {
      const trip = await createTrip(pickup.trim(), dropoff.trim())
      navigate(`/passenger/trips/${trip.id}`)
    } catch {
      setError('Error al crear el viaje')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <button
        onClick={() => navigate('/passenger')}
        className="text-sm text-slate-500 hover:text-slate-800 mb-4 underline"
      >
        ← Volver al dashboard
      </button>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h1 className="text-xl font-bold text-slate-800 mb-4">Solicitar viaje</h1>

        {loadingDrivers ? (
          <p className="text-sm text-slate-500 mb-4">Cargando conductores disponibles...</p>
        ) : (
          <p className="text-sm text-slate-500 mb-4">
            Conductores disponibles: <span className="font-semibold text-slate-700">{drivers.length}</span>
          </p>
        )}

        {!loadingDrivers && drivers.length > 0 && (
          <div className="mb-4 space-y-1">
            {drivers.map((d) => (
              <div key={d.id} className="text-xs text-slate-500">
                {d.firstName} {d.lastName} — ⭐ {d.rating.toFixed(1)}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
            name="pickup"
            placeholder="Dirección de origen"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
          />
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
            name="dropoff"
            placeholder="Dirección de destino"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
          />
          {error && <span className="block text-sm text-red-600">{error}</span>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white font-semibold py-2 rounded-lg transition"
          >
            {submitting ? 'Solicitando...' : 'Solicitar viaje'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RequestTripPage
