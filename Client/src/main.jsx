import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'
import { RefreshProvider } from './context/RefreshProvider.jsx'

createRoot(document.getElementById('root')).render(
  <RefreshProvider>
    <Toaster position="top-center" reverseOrder={false} />
    <App />
  </RefreshProvider>,
)
