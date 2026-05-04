import { useEffect, useState } from 'react'

const useLocalStorage = (key) => {
  const [data, setData] = useState(null)

  useEffect(() => {
    const getData = () => {
      const item = localStorage.getItem(key)
      if (item) {
        try {
          setData(JSON.parse(item))
        } catch {
          setData(item)
        }
      } else {
        setData(null)
      }
    }

    getData()

    window.addEventListener('storage', getData)
    window.addEventListener('localStorageChange', getData)

    return () => {
      window.removeEventListener('storage', getData)
      window.removeEventListener('localStorageChange', getData)
    }
  }, [key])

  return data
}

export default useLocalStorage
