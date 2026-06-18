import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#1A1A27',
          color: '#E8E8F0',
          border: '1px solid #2A2A3D',
          borderRadius: '10px',
        },
        success: {
          iconTheme: { primary: '#F5C518', secondary: '#0A0A0F' },
        },
        error: {
          iconTheme: { primary: '#E53935', secondary: '#E8E8F0' },
        },
      }}
    />
  </React.StrictMode>
)