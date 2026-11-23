import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Mengalihkan ke /login (menyimpan halaman tujuan) jika belum login.
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />
}
