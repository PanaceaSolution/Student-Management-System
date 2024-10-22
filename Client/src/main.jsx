import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthProvider.jsx'
import  { Toaster } from 'react-hot-toast';
createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
    <Toaster/>
  </AuthProvider>,
)
