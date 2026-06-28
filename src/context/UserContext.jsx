import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'

const UserContext = createContext(null)

const loadUserFromStorage = () => {
  try {
    const item = localStorage.getItem('user')
    if (!item) return null

    try {
      return JSON.parse(item)
    } catch {
      return item
    }
  } catch {
    return null
  }
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const updateUserFromStorage = useCallback(() => {
    const loadedUser = loadUserFromStorage()
    setUser(loadedUser)
    setLoading(false)
  }, [])

  useEffect(() => {
    updateUserFromStorage()
  }, [updateUserFromStorage])

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : null
          setUser(newValue)
        } catch {
          setUser(e.newValue)
        }
        setLoading(false)
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

  const updateUser = useCallback((newUser) => {
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

  const logout = useCallback(() => {
    localStorage.clear()
    setUser(null)
    window.dispatchEvent(new Event('localStorageChange'))
  }, [])

  const value = {
    user,
    setUser: updateUser,
    logout,
    loading,
    isAuthenticated: !!user,
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
