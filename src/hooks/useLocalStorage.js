import { useEffect, useState } from 'react'

const useLocalStorage = (key) => {
  const [data, setData] = useState(null)

  useEffect(() => {
    const item = localStorage.getItem(key)

    if (item) {
      try {
        setData(JSON.parse(item))
      } catch {
        setData(item)
      }
    }
  }, [key])

  return data
}

export default useLocalStorage
