import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import NotificationList from './NotificationList'
import { useSettings } from '../context/SettingsContext' // 🔥 Ayarları çektik

export default function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const user = JSON.parse(localStorage.getItem('user'))

    // 🔥 Context'ten ayarları alıyoruz
    const { theme, toggleTheme, lang, toggleLang, t } = useSettings();

    const [unreadCount, setUnreadCount] = useState(0)
    const [showNotifications, setShowNotifications] = useState(false)

    useEffect(() => {
        if (user) fetchUnreadCount()
        const interval = setInterval(() => {
            if(user) fetchUnreadCount()
        }, 30000);
        return () => clearInterval(interval);
    }, [location.pathname])

    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/notifications/${user.id}/count`)
            setUnreadCount(response.data)
        } catch (error) { console.error("Bildirim hatası") }
    }

    const handleLogout = () => {
        localStorage.removeItem('user')
        navigate('/')
        window.location.reload()
    }

    if (location.pathname === '/login' || location.pathname === '/register') return null

    return (
        // bg-white yerine dinamik arka plan rengi için Bootstrap sınıflarını kullanıyoruz
        <nav className={`navbar navbar-expand-lg border-bottom px-4 sticky-top ${theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-white'}`}>
            <div className="container-fluid">
                {/* 🔥 DEĞİŞİKLİK BURADA: t('navbar.brand') */}
                <Link className="navbar-brand fw-bold text-primary" to={user ? "/dashboard" : "/"}>
                    {t('navbar.brand')}
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center gap-2">

                        {/* 🌙 TEMA DEĞİŞTİRME BUTONU */}
                        <li className="nav-item">
                            <button onClick={toggleTheme} className="btn btn-sm btn-outline-secondary border-0 fs-5">
                                {theme === 'light' ? '🌙' : '☀️'}
                            </button>
                        </li>

                        {/* 🌍 DİL DEĞİŞTİRME BUTONU */}
                        <li className="nav-item">
                            <button onClick={toggleLang} className="btn btn-sm fw-bold btn-outline-primary">
                                {lang === 'tr' ? 'EN' : 'TR'}
                            </button>
                        </li>

                        {user ? (
                            <>
                                {/* ZİL */}
                                <li className="nav-item me-2 position-relative">
                                    <button
                                        onClick={() => { setShowNotifications(!showNotifications); fetchUnreadCount(); }}
                                        className="btn position-relative border-0 bg-transparent fs-5"
                                    >
                                        🔔
                                        {unreadCount > 0 && (
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light" style={{fontSize: '0.6rem'}}>
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>
                                    {showNotifications && <NotificationList user={user} onClose={() => setShowNotifications(false)} />}
                                </li>

                                <li className="nav-item d-none d-lg-block">
                                  <span className={`nav-link fw-bold border-start ps-3 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
                                    {t('navbar.welcome')}, {user.firstName}
                                  </span>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/dashboard">{t('navbar.dashboard')}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">{t('navbar.profile')}</Link>
                                </li>
                                <li className="nav-item ms-2">
                                    <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-pill px-3">
                                        {t('navbar.logout')}
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">{t('navbar.home')}</Link>
                                </li>
                                <li className="nav-item ms-2">
                                    <Link className="btn btn-outline-primary btn-sm" to="/login">{t('navbar.login')}</Link>
                                </li>
                                <li className="nav-item ms-2">
                                    <Link className="btn btn-primary btn-sm" to="/register">{t('navbar.register')}</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}