import { useEffect, useState } from 'react';
import { getTripById, completeTrip } from '../services/driverService';
import type { Trip } from '../types';
import StatusBadge from '../statusBadge';

interface Props {
  tripId: number;
  onBack: () => void;
}

// Punto 6: Detalle de viaje (conductor)
// - Muestra pickup, dropoff y datos del pasajero
// - Botón "Completar viaje" si el estado es IN_PROGRESS
// - Muestra un resumen luego de completar
export default function TripDetail({ tripId, onBack }: Props) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadTrip() {
      try {
        const data = await getTripById(tripId);
        setTrip(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el viaje');
      } finally {
        setLoading(false);
      }
    }
    loadTrip();
  }, [tripId]);

  async function handleComplete() {
    setCompleting(true);
    setError('');
    try {
      const updated = await completeTrip(tripId);
      setTrip(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar el viaje');
    } finally {
      setCompleting(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Cargando viaje...</div>;
  }

  if (!trip) {
    return (
      <div className="p-8 text-center text-red-600">
        {error || 'No se encontró el viaje'}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <button
        onClick={onBack}
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
        </div>

        <div className="bg-slate-50 rounded-lg p-4 mb-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-1">Pasajero</h2>
          <p className="text-sm text-slate-700">
            {trip.passenger.firstName} {trip.passenger.lastName}
          </p>
          <p className="text-xs text-slate-500">{trip.passenger.email}</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Botón visible solo mientras el viaje está en curso */}
        {trip.status === 'IN_PROGRESS' && (
          <button
            onClick={handleComplete}
            disabled={completing}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-2 rounded-lg transition"
          >
            {completing ? 'Completando...' : 'Completar viaje'}
          </button>
        )}

        {/* Resumen luego de completar */}
        {trip.status === 'COMPLETED' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-green-800 mb-1">
              Viaje completado ✅
            </h2>
            <p className="text-sm text-slate-700">
              Finalizado el:{' '}
              {trip.completedAt ? new Date(trip.completedAt).toLocaleString() : '-'}
            </p>
            <p className="text-sm text-slate-700">
              Calificación del pasajero:{' '}
              {trip.passengerRating ? `⭐ ${trip.passengerRating}` : 'Aún sin calificar'}
            </p>
            {trip.ratingComment && (
              <p className="text-sm text-slate-500 italic mt-1">
                "{trip.ratingComment}"
              </p>
            )}
          </div>
        )}

        {trip.status === 'PENDING' && (
          <p className="text-sm text-slate-500">
            Este viaje aún no ha sido aceptado.
          </p>
        )}
      </div>
    </div>
  );
}
