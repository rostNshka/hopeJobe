import { makeAutoObservable, runInAction } from 'mobx'
import { IUserContextData } from '@/types/entities/user.types'

class UserStore {
  user: IUserContextData | null = null
  token: string | null = null
  loading: boolean = true

  constructor() {
    makeAutoObservable(this)
    this.loadFromStorage()

    window.addEventListener('storage', this.handleStorageChange.bind(this))
  }

  private loadFromStorage() {
    try {
      const userItem = localStorage.getItem('user')
      const tokenItem = localStorage.getItem('token')

      runInAction(() => {
        this.user = userItem ? JSON.parse(userItem) : null
        this.token = tokenItem || null
        this.loading = false
      })
    } catch {
      runInAction(() => {
        this.user = null
        this.token = null
        this.loading = false
      })
    }
  }

  private handleStorageChange(e: StorageEvent) {
    if (e.key === 'user') {
      runInAction(() => {
        try {
          this.user = e.newValue ? JSON.parse(e.newValue) : null
        } catch {
          this.user = null
        }
      })
    }
    if (e.key === 'token') {
      runInAction(() => {
        this.token = e.newValue
      })
    }
  }

  setUser(user: IUserContextData | null) {
    runInAction(() => {
      this.user = user
      if (user === null) {
        localStorage.removeItem('user')
      } else {
        localStorage.setItem('user', JSON.stringify(user))
      }
    })
    this.notifyOtherTabs()
  }

  setToken(token: string | null) {
    runInAction(() => {
      this.token = token
      if (token === null) {
        localStorage.removeItem('token')
      } else {
        localStorage.setItem('token', token)
      }
    })
    this.notifyOtherTabs()
  }

  logout() {
    runInAction(() => {
      localStorage.clear()
      this.user = null
      this.token = null
    })
    this.notifyOtherTabs()
  }

  private notifyOtherTabs() {
    window.dispatchEvent(new Event('localStorageChange'))
  }

  get isAuthenticated(): boolean {
    return !!this.user && !!this.token
  }

  dispose() {
    window.removeEventListener('storage', this.handleStorageChange.bind(this))
  }
}

export const userStore = new UserStore()
