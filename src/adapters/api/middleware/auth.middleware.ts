import { Middleware } from '@/types/entities/api.client.types'
import { userStore } from '@/stores/user-store'

export const authMiddleware: Middleware = request => {
  const token = userStore.accessToken
  const skipAuth = request.skipAuth

  if (token && !skipAuth) {
    request.headers = {
      ...request.headers,
      Authorization: `Bearer ${token}`,
    }
  }
  return request
}
