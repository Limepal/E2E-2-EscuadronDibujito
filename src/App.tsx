import { useState } from 'react';
import Login from './Pages/LoginPage';
import DriverDashboard from './Pages/DriverDashboard';
import TripDetail from './Pages/TripDetail';


// Navegación simple con un estado, sin librerías de routing.
type View = 'login' | 'dashboard' | 'detail';

export default function App() {
  const [view, setView] = useState<View>(
    localStorage.getItem('token') ? 'dashboard' : 'login'
  );
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);

  function handleLoginSuccess() {
    setView('dashboard');
  }

  function handleOpenTrip(tripId: number) {
    setSelectedTripId(tripId);
    setView('detail');
  }

  function handleBackToDashboard() {
    setSelectedTripId(null);
    setView('dashboard');
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setView('login');
  }

  if (view === 'login') {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (view === 'detail' && selectedTripId !== null) {
    return <TripDetail tripId={selectedTripId} onBack={handleBackToDashboard} />;
  }

  return <DriverDashboard onOpenTrip={handleOpenTrip} onLogout={handleLogout} />;
}
