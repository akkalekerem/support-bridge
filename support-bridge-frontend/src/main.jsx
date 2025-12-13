import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// 1. Bootstrap CSS dosyasını projeye dahil ediyoruz (Tasarım için şart)
import 'bootstrap/dist/css/bootstrap.min.css'
// 2. Sayfalar arası gezinme (Router) özelliğini aktif ediyoruz
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
)