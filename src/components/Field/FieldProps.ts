import { ChangeEvent } from 'react'

export interface FieldProps {
  htmlFor: string
  label: string
  type?: string
  id: string
  name?: string
  placeholder?: string
  value?: string
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onFocus?: () => void
  onBlur?: () => void
}

export type TypePassword = 'password' | 'text'
