import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'
import PassangerDashboardPage from './Pages/PassangerDashboardPage'
import DriverDashboard from './Pages/DriverDashboard'
import TripDetail from './Pages/TripDetail'
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

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className='p-6'>
      {/* Aca va la pantalla real de: {title} */}
      <h1>{title}</h1>
    </div>
  )
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
          <Route path='/passenger/request-trip' element={<PlaceholderPage title='Solicitar viaje' />} />
          <Route path='/passenger/trips/:id' element={<PlaceholderPage title='Detalle de viaje pasajero' />} />
          <Route path='/passenger/history' element={<PlaceholderPage title='Historial pasajero' />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['DRIVER']} />}>
          <Route path='/driver' element={<DriverDashboardRoute />} />
          <Route path='/driver/trips/:id' element={<DriverTripDetailRoute />} />
          <Route path='/driver/history' element={<PlaceholderPage title='Historial conductor' />} />
        </Route>

        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
