import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import { IUserUpdateData } from '@/types/entities/user.types'

export interface IUserContext {
  user: IUserUpdateData | null
  token: string | null
  setUser: (user: IUserUpdateData | null) => void
  setToken: (token: string | null) => void
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
}

export interface IUserProviderProps {
  children: ReactNode
}

const UserContext = createContext<IUserContext | null>(null)

const loadUserFromStorage = (): IUserUpdateData | null => {
  try {
    const item = localStorage.getItem('user')
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}

const loadTokenFromStorage = () => {
  try {
    return localStorage.getItem('token')
  } catch {
    return null
  }
}

export const UserProvider = ({ children }: IUserProviderProps) => {
  const [user, setUser] = useState<IUserUpdateData | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const updateUserFromStorage = useCallback(() => {
    const loadedUser = loadUserFromStorage()
    const loadedToken = loadTokenFromStorage()
    setUser(loadedUser)
    setToken(loadedToken)
    setLoading(false)
  }, [])

  useEffect(() => {
    updateUserFromStorage()
  }, [updateUserFromStorage])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : null
          setUser(newValue)
        } catch {
          setUser(null)
        }
        setLoading(false)
      }
      if (e.key === 'token') {
        setToken(e.newValue)
      }
    }

    const handleLocalStorageChange = () => {
      updateUserFromStorage()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('localStorageChange', handleLocalStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('localStorageChange', handleLocalStorageChange)
    }
  }, [updateUserFromStorage])

  const updateUser = useCallback((newUser: IUserUpdateData | null) => {
    try {
      if (newUser === null) {
        localStorage.removeItem('user')
      } else {
        localStorage.setItem('user', JSON.stringify(newUser))
      }
      setUser(newUser)
      window.dispatchEvent(new Event('localStorageChange'))
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }, [])

  const updateToken = useCallback((newToken: string | null) => {
    try {
      if (newToken === null) {
        localStorage.removeItem('token')
      } else {
        localStorage.setItem('token', newToken)
      }
      setToken(newToken)
      window.dispatchEvent(new Event('localStorageChange'))
    } catch (error) {
      console.error('Error updating token:', error)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.clear()
    setUser(null)
    setToken(null)
    window.dispatchEvent(new Event('localStorageChange'))
  }, [])

  const value: IUserContext = {
    user,
    token,
    setUser: updateUser,
    setToken: updateToken,
    logout,
    loading,
    isAuthenticated: !!user && !!token,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export default UserContext
