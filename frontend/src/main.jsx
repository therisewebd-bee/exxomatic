import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import App from './App.jsx'
import './index.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'

// Auto-reload the page if a Vite chunk fails to load (e.g., after a new Netlify deploy)
window.addEventListener('vite:preloadError', (event) => {
    console.warn('Vite chunk load failed, forcing page reload...', event);
    window.location.reload();
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </React.StrictMode>,
)
