import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { sessionService } from './adapters/api/sessionService.ts'
import App from './App.tsx'
import './styles'

const rootElement = document.getElementById('root')

await sessionService.initializeSession()

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
