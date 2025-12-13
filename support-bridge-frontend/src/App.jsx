import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar' // 1. IMPORT ET
import Profile from './pages/Profile'

function App() {
    return (
        <>
            {/* 2. NAVBAR'I BURAYA KOY (Routes'un dışına,     en tepeye) */}
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </>
    )
}

export default App