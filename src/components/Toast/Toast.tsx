import { observer } from 'mobx-react-lite'
import './Toast.scss'
import toastStore from '@/stores/toast-store'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const Toast = observer(() => {
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) {
    return null
  }

  if (toastStore.toasts.length === 0) {
    return null
  }

  return createPortal(
    <div className="toast">
      {toastStore.toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast-message toast-message--${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>,
    document.body
  )
})

export default Toast
