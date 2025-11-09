import React from 'react'
import { createRoot } from 'react-dom/client'
import AppEnhanced from './AppEnhanced'
import { ClientProvider } from './context/ClientContext'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClientProvider>
      <AppEnhanced />
    </ClientProvider>
  </React.StrictMode>
)
