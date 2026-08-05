import { ApiClient } from './apiClient'
import { authMiddleware } from './middleware/auth.middleware'
import { loggingMiddleware } from './middleware/logging.middleware'
import { errorMiddleware } from './middleware/error.middleware'

export const apiClient = new ApiClient({
  baseURL: '/api',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
})
  .use(authMiddleware)
  .use(loggingMiddleware)
  .use(errorMiddleware)
