import { useEffect, useState } from 'react';
import {getMyTrips, getPendingTrips, acceptTrip } from '../services/driverService';
import {getMe} from '../services/userService';
import type { Trip, User } from '../types/index';
import StatusBadge from '../statusBadge';


interface Props {
  onOpenTrip: (tripId: number) => void;
  onLogout: () => void;
}


export default function DriverDashboard({ onOpenTrip, onLogout }: Props) {
  const [me, setMe] = useState<User | null>(null);
  const [pendingTrips, setPendingTrips] = useState<Trip[]>([]);
  const [myTrips, setMyTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acceptingId, setAcceptingId] = useState<number | null>(null);

  async function loadData() {
    try {
      const [meData, pending, mine] = await Promise.all([
        getMe(),
        getPendingTrips(),
        getMyTrips(),
      ]);
      setMe(meData);
      setPendingTrips(pending);
      setMyTrips(mine);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAccept(tripId: number) {
    setAcceptingId(tripId);
    setError('');
    try {
      await acceptTrip(tripId);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo aceptar el viaje');
    } finally {
      setAcceptingId(null);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Cargando...</div>;
  }

  // El viaje activo es el único que puede estar IN_PROGRESS a la vez
  const activeTrip = myTrips.find((t) => t.status === 'IN_PROGRESS') || null;
  const completedTrips = myTrips.filter((t) => t.status === 'COMPLETED');

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Encabezado con datos del conductor */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Hola, {me?.firstName} 👋
          </h1>
          <p className="text-slate-500 text-sm">
            Tu rating actual:{' '}
            <span className="font-semibold text-amber-600">
              ⭐ {me?.rating.toFixed(1)}
            </span>
          </p>
        </div>
        <button
          onClick={onLogout}
          className="text-sm text-slate-500 hover:text-slate-800 underline"
        >
          Cerrar sesión
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Viaje activo resaltado */}
      {activeTrip && (
        <div className="bg-blue-50 border border-blue-300 rounded-xl p-5 mb-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className="font-semibold text-blue-900">Viaje activo</h2>
            <StatusBadge status={activeTrip.status} />
          </div>
          <p className="text-sm text-slate-700">
            <span className="font-medium">Desde:</span> {activeTrip.pickupAddress}
          </p>
          <p className="text-sm text-slate-700 mb-4">
            <span className="font-medium">Hasta:</span> {activeTrip.dropoffAddress}
          </p>
          <button
            onClick={() => onOpenTrip(activeTrip.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            Completar viaje
          </button>
        </div>
      )}

      {/* Lista de viajes pendientes */}
      <div className="mb-8">
        <h2 className="font-semibold text-slate-800 mb-3">Viajes disponibles</h2>
        {pendingTrips.length === 0 ? (
          <p className="text-sm text-slate-500">No hay viajes pendientes por ahora.</p>
        ) : (
          <div className="space-y-3">
            {pendingTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm text-slate-800 font-medium">
                    {trip.pickupAddress} → {trip.dropoffAddress}
                  </p>
                  <p className="text-xs text-slate-500">
                    Pasajero: {trip.passenger.firstName} {trip.passenger.lastName}
                  </p>
                </div>
                <button
                  onClick={() => handleAccept(trip.id)}
                  disabled={acceptingId === trip.id || !!activeTrip}
                  className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                >
                  {acceptingId === trip.id ? 'Aceptando...' : 'Aceptar'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historial simple de viajes completados */}
      <div>
        <h2 className="font-semibold text-slate-800 mb-3">Viajes completados</h2>
        {completedTrips.length === 0 ? (
          <p className="text-sm text-slate-500">Todavía no has completado viajes.</p>
        ) : (
          <div className="space-y-2">
            {completedTrips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => onOpenTrip(trip.id)}
                className="bg-white border border-slate-200 rounded-xl p-3 flex justify-between items-center cursor-pointer hover:bg-slate-50"
              >
                <p className="text-sm text-slate-700">
                  {trip.pickupAddress} → {trip.dropoffAddress}
                </p>
                <StatusBadge status={trip.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}