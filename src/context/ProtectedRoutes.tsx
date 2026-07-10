import { Outlet, Navigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { userStore } from '@/stores/user-store'

const ProtectedRoutes = observer(() => {
  if (userStore.loading) {
    return <div>Загрузка...</div>
  }

  return userStore.isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
})

export default ProtectedRoutes
