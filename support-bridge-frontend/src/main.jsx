import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { SettingsProvider } from './context/SettingsContext'
// Bootstrap CSS (Eğer main.jsx içindeyse kalsın, yoksa index.html'dedir)
import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <SettingsProvider> {/* 🔥 Uygulamayı Sarmaladık */}
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </SettingsProvider>
    </React.StrictMode>,
)