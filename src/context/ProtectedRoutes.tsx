import { Outlet, Navigate } from 'react-router-dom'
import { useUser } from '@/context/UserContext.tsx'

const ProtectedRoutes = () => {
  const { isAuthenticated } = useUser()
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
}

export default ProtectedRoutes
