import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AuthSuccess from './pages/authSuccess.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/map" element={<div>Map goes here</div>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)