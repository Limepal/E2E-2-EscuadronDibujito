import { useEffect, useState, useCallback, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTripById, rateTrip } from '../services/passengerService'
import type { Trip } from '../types'
import StatusBadge from '../statusBadge'

interface Props {
  tripId: number
}

export default function PassengerTripDetailPage({ tripId }: Props) {
  const navigate = useNavigate()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [ratingError, setRatingError] = useState('')
  const [submittingRating, setSubmittingRating] = useState(false)

  const loadTrip = useCallback(async () => {
    try {
      const data = await getTripById(tripId)
      setTrip(data)
    } catch {
      setError('Error al cargar el viaje')
    } finally {
      setLoading(false)
    }
  }, [tripId])

  useEffect(() => {
    loadTrip()
  }, [loadTrip])

  useEffect(() => {
    if (!trip) return
    if (trip.status === 'PENDING' || trip.status === 'IN_PROGRESS') {
      const interval = setInterval(loadTrip, 4000)
      return () => clearInterval(interval)
    }
  }, [trip?.status, loadTrip, trip])

  const handleRate = async (e: FormEvent) => {
    e.preventDefault()
    if (rating < 1 || rating > 5) {
      setRatingError('Selecciona una calificación entre 1 y 5')
      return
    }
    setSubmittingRating(true)
    setRatingError('')
    try {
      const updated = await rateTrip(tripId, rating, comment || undefined)
      setTrip(updated)
    } catch {
      setRatingError('Error al calificar el viaje')
    } finally {
      setSubmittingRating(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Cargando viaje...</div>
  }

  if (!trip) {
    return (
      <div className="p-8 text-center text-red-600">
        {error || 'No se encontró el viaje'}
      </div>
    )
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
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-xl font-bold text-slate-800">Viaje #{trip.id}</h1>
          <StatusBadge status={trip.status} />
        </div>

        <div className="mb-4 space-y-1">
          <p className="text-sm text-slate-700">
            <span className="font-medium">Origen:</span> {trip.pickupAddress}
          </p>
          <p className="text-sm text-slate-700">
            <span className="font-medium">Destino:</span> {trip.dropoffAddress}
          </p>
          <p className="text-xs text-slate-500">
            Solicitado: {new Date(trip.requestedAt).toLocaleString()}
          </p>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 mb-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-1">Conductor</h2>
          {trip.driver ? (
            <>
              <p className="text-sm text-slate-700">
                {trip.driver.firstName} {trip.driver.lastName}
              </p>
              <p className="text-xs text-slate-500">⭐ {trip.driver.rating.toFixed(1)}</p>
            </>
          ) : (
            <p className="text-sm text-slate-500">Buscando conductor...</p>
          )}
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        {trip.status === 'COMPLETED' && trip.passengerRating === null && (
          <form onSubmit={handleRate} className="border-t border-slate-200 pt-4 mt-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-800">Calificar viaje</h3>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl transition ${star <= rating ? 'text-amber-400' : 'text-slate-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
              placeholder="Comentario (opcional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
            />
            {ratingError && <span className="block text-sm text-red-600">{ratingError}</span>}
            <button
              type="submit"
              disabled={submittingRating}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              {submittingRating ? 'Enviando...' : 'Enviar calificación'}
            </button>
          </form>
        )}

        {trip.status === 'COMPLETED' && trip.passengerRating !== null && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <h3 className="text-sm font-semibold text-green-800 mb-1">
              Calificación enviada ✅
            </h3>
            <p className="text-sm text-slate-700">
              ⭐ {trip.passengerRating}
            </p>
            {trip.ratingComment && (
              <p className="text-sm text-slate-500 italic mt-1">"{trip.ratingComment}"</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
