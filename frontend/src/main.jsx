import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './Components/Main/Auth/AuthProvider.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>  
        <AuthProvider> 
          <App />
        </AuthProvider> 
      </BrowserRouter>
  </StrictMode>,
)
