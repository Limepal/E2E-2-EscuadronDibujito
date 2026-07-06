import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'
import PassangerDashboardPage from './Pages/PassangerDashboardPage'
import DriverDashboard from './Pages/DriverDashboard'
import TripDetail from './Pages/TripDetail'
import RequestTripPage from './Pages/RequestTripPage'
import PassengerTripDetailPage from './Pages/PassengerTripDetailPage'
import Historial from './Pages/Historial'
import ProtectedRoute from './routes/ProtectedRoute'
import useAuth from './hooks/useAuth'
import type { Role } from './types'

function getHomePath(role: Role) {
  return role === 'DRIVER' ? '/driver' : '/passenger'
}

function RoleRedirect() {
  const { token, user, loading } = useAuth()

  if (!token) {
    return <Navigate to='/login' replace />
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  if (!user) {
    return <Navigate to='/login' replace />
  }

  return <Navigate to={getHomePath(user.role)} replace />
}

function DriverDashboardRoute() {
  const navigate = useNavigate()

  return (
    <DriverDashboard
      onOpenTrip={(tripId) => navigate(`/driver/trips/${tripId}`)}
      onLogout={() => {
        localStorage.removeItem('token')
        navigate('/login', { replace: true })
      }}
      onHistory={() => navigate('/driver/history')}
    />
  )
}

function DriverTripDetailRoute() {
  const navigate = useNavigate()
  const { id } = useParams()
  const tripId = Number(id)

  if (!id || Number.isNaN(tripId)) {
    return <Navigate to='/driver' replace />
  }

  return <TripDetail tripId={tripId} onBack={() => navigate('/driver')} />
}

function PassengerTripDetailRoute() {
  const { id } = useParams()
  const tripId = Number(id)

  if (!id || Number.isNaN(tripId)) {
    return <Navigate to='/passenger' replace />
  }

  return <PassengerTripDetailPage tripId={tripId} />
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RoleRedirect />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        <Route element={<ProtectedRoute allowedRoles={['PASSENGER']} />}>
          <Route path='/passenger' element={<PassangerDashboardPage />} />
          <Route path='/passenger/request-trip' element={<RequestTripPage />} />
          <Route path='/passenger/trips/:id' element={<PassengerTripDetailRoute />} />
          <Route path='/passenger/history' element={<Historial />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['DRIVER']} />}>
          <Route path='/driver' element={<DriverDashboardRoute />} />
          <Route path='/driver/trips/:id' element={<DriverTripDetailRoute />} />
          <Route path='/driver/history' element={<Historial />} />
        </Route>

        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
