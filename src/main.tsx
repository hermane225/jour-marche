import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.tsx'
import { config } from './config'
import { ErrorBoundary } from './components/ui/ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={config.googleClientId}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </GoogleOAuthProvider>,
)
