import { makeAutoObservable } from 'mobx'

export enum ToastType {
  success = 'success',
  error = 'error',
  info = 'info',
  warning = 'warning',
}

export interface IToast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

class ToastStore {
  toasts: IToast[] = []

  constructor() {
    makeAutoObservable(this)
  }

  showToast = (
    message: string,
    type: ToastType = ToastType.info,
    duration: number = 3000
  ) => {
    const id =
      Date.now().toString() + Math.random().toString(36).substring(2, 9)
    const toast: IToast = {
      id,
      message,
      type,
      duration,
    }

    this.toasts.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(id)
      }, duration)
    }

    return id
  }

  showSuccess = (message: string, duration?: number) => {
    return this.showToast(message, ToastType.success, duration)
  }

  showError = (message: string, duration?: number) => {
    return this.showToast(message, ToastType.error, duration)
  }

  showInfo = (message: string, duration?: number) => {
    return this.showToast(message, ToastType.info, duration)
  }

  showWarning = (message: string, duration?: number) => {
    return this.showToast(message, ToastType.warning, duration)
  }

  removeToast = (id: string) => {
    this.toasts = this.toasts.filter(toast => toast.id !== id)
  }

  clearAll = () => {
    this.toasts = []
  }
}

export default new ToastStore()
