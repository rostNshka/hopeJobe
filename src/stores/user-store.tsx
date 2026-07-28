import { makeAutoObservable, runInAction } from 'mobx'
import { IUserContextData } from '@/types/entities/user.types'

const STORAGE_KEYS = {
  USER: 'user',
  REFRESH_TOKEN: 'refreshToken',
} as const

class UserStore {
  user: IUserContextData | null = null
  refreshToken: string | null = null
  accessToken: string | null = null
  loading: boolean = true

  private boundHandleStorageChange = this.handleStorageChange.bind(this)

  constructor() {
    makeAutoObservable(this)
    this.loadFromStorage()
    window.addEventListener('storage', this.boundHandleStorageChange)
  }

  private loadFromStorage() {
    try {
      const userItem = localStorage.getItem(STORAGE_KEYS.USER)
      const refreshTokenItem = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)

      runInAction(() => {
        this.user = userItem ? JSON.parse(userItem) : null
        this.refreshToken = refreshTokenItem || null
        this.accessToken = null
        this.loading = false
      })
    } catch {
      runInAction(() => {
        this.user = null
        this.refreshToken = null
        this.accessToken = null
        this.loading = false
      })
    }
  }

  private handleStorageChange(e: StorageEvent) {
    if (e.key === STORAGE_KEYS.USER) {
      runInAction(() => {
        try {
          this.user = e.newValue ? JSON.parse(e.newValue) : null
        } catch {
          this.user = null
        }
      })
    }
    if (e.key === STORAGE_KEYS.REFRESH_TOKEN) {
      runInAction(() => {
        this.refreshToken = e.newValue
        if (e.newValue === null) {
          this.accessToken = null
          this.user = null
        }
      })
    }
  }

  setUser(user: IUserContextData | null) {
    runInAction(() => {
      this.user = user
    })

    if (user === null) {
      localStorage.removeItem(STORAGE_KEYS.USER)
    } else {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    }

    this.notifyOtherTabs()
  }

  setTokens(accessToken: string | null, refreshToken: string | null) {
    runInAction(() => {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
    })

    if (refreshToken === null) {
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    } else {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
    }

    this.notifyOtherTabs()
  }

  setAccessToken(accessToken: string | null) {
    runInAction(() => {
      this.accessToken = accessToken
    })
  }

  setRefreshToken(refreshToken: string | null) {
    runInAction(() => {
      this.refreshToken = refreshToken
    })

    if (refreshToken === null) {
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    } else {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
    }

    this.notifyOtherTabs()
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)

    runInAction(() => {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
    })

    this.notifyOtherTabs()
  }

  private notifyOtherTabs() {
    window.dispatchEvent(new Event('localStorageChange'))
  }

  get isAuthenticated(): boolean {
    return !!this.user && !!this.accessToken
  }

  dispose() {
    window.removeEventListener('storage', this.boundHandleStorageChange)
  }
}

export const userStore = new UserStore()
