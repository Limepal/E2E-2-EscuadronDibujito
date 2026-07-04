import type { TripStatus } from './types';

const STYLES: Record<TripStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
};

const LABELS: Record<TripStatus, string> = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En curso',
  COMPLETED: 'Completado',
};

export default function StatusBadge({ status }: { status: TripStatus }) {
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}
