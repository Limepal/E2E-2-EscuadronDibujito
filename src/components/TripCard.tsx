import type { Trip } from "../types";

interface TripCardProps {
  trip: Trip;
}

function TripCard({ trip }: TripCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center">
      <div>
        <p className="text-sm text-slate-800 font-medium">
          {trip.pickupAddress} → {trip.dropoffAddress}
        </p>
        <p className="text-xs text-slate-500">
          Pasajero: {trip.passenger.firstName} {trip.passenger.lastName}
        </p>
      </div>
    </div>
  )
}

export default TripCard
