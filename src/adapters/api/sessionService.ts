import { userStore } from '@/stores/user-store'
import { apiClient } from '@/adapters/api/apiClient.instance'

let isInitialized = false
let initializationPromise: Promise<void> | null = null

export const sessionService = {
  async initializeSession(): Promise<void> {
    if (isInitialized) {
      return
    }

    if (initializationPromise) {
      return initializationPromise
    }

    initializationPromise = this.performInitialization()
    return initializationPromise
  },

  async performInitialization(): Promise<void> {
    try {
      const user = userStore.user
      const refreshToken = userStore.refreshToken

      if (!user || !refreshToken) {
        isInitialized = true
        return
      }

      if (userStore.accessToken) {
        isInitialized = true
        return
      }

      await this.refreshSession()
    } catch (error) {
      isInitialized = true
    } finally {
      isInitialized = true
      initializationPromise = null
    }
  },

  async refreshSession(): Promise<void> {
    const refreshToken = userStore.refreshToken

    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await apiClient.request<{
      accessToken: string
      refreshToken: string
    }>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
      skipAuth: true,
    })

    userStore.setTokens(response.accessToken, response.refreshToken)
  },

  isSessionInitialized(): boolean {
    return isInitialized
  },
}
