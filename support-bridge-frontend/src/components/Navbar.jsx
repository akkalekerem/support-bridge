import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import axios from 'axios';

export default function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useTranslation();

    // LocalStorage'dan kullanıcıyı kontrol et
    const user = JSON.parse(localStorage.getItem('user'))

    // Bildirim State'leri
    const [notifications, setNotifications] = useState([])
    const [showNotifications, setShowNotifications] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    // Çıkış yapma fonksiyonu
    const handleLogout = () => {
        localStorage.removeItem('user')
        navigate('/')
        window.location.reload() // Menüyü yenilemek için sayfayı yenile
    }

    // Bildirimleri Getir
    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const response = await axios.get(`http://localhost:8080/api/notifications/${user.id}`)
            setNotifications(response.data)
            // Okunmamışları say
            const unread = response.data.filter(n => !n.read).length
            setUnreadCount(unread)
        } catch (error) {
            console.error("Bildirimler alınamadı:", error)
        }
    }

    // Component açılınca ve her 30 sn'de bir bildirimleri çek
    useEffect(() => {
        fetchNotifications()
        const interval = setInterval(fetchNotifications, 30000)
        return () => clearInterval(interval)
    }, [user?.id])

    // Bildirimi okundu olarak işaretle
    const markAsRead = async (id) => {
        try {
            await axios.put(`http://localhost:8080/api/notifications/${id}/read`)
            // Listeyi güncelle (Frontend'de anlık olarak okundu yap)
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (error) {
            console.error(error)
        }
    }

    // Eğer Login veya Register sayfasındaysak Navbar'ı gösterme (Opsiyonel, daha temiz durur)
    if (location.pathname === '/login' || location.pathname === '/register') {
        return null
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 sticky-top">
            <div className="container-fluid">
                {/* LOGO */}
                <Link className="navbar-brand fw-bold text-primary" to={user ? "/dashboard" : "/"}>
                    Support Bridge 🌉
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item me-3">
                            <LanguageSwitcher />
                        </li>

                        {user ? (
                            // --- GİRİŞ YAPMIŞ KULLANICI MENÜSÜ ---
                            <>
                                {/* Bildirim İkonu */}
                                <li className="nav-item me-3 position-relative">
                                    <button 
                                        className="btn btn-light position-relative"
                                        onClick={() => setShowNotifications(!showNotifications)}
                                    >
                                        🔔
                                        {unreadCount > 0 && (
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {/* Bildirim Dropdown */}
                                    {showNotifications && (
                                        <div className="position-absolute end-0 mt-2 bg-white shadow rounded border p-2" style={{ width: '300px', zIndex: 1000, maxHeight: '400px', overflowY: 'auto' }}>
                                            <h6 className="dropdown-header border-bottom mb-2">Bildirimler</h6>
                                            {notifications.length === 0 ? (
                                                <p className="text-center text-muted small p-2">Hiç bildirim yok.</p>
                                            ) : (
                                                notifications.map(notif => (
                                                    <div 
                                                        key={notif.id} 
                                                        className={`p-2 border-bottom ${notif.read ? 'bg-light text-muted' : 'bg-white fw-bold'}`}
                                                        style={{ cursor: 'pointer', fontSize: '0.9rem' }}
                                                        onClick={() => markAsRead(notif.id)}
                                                    >
                                                        {notif.message}
                                                        <br />
                                                        <small className="text-secondary" style={{ fontSize: '0.7rem' }}>
                                                            {new Date(notif.createdAt).toLocaleString()}
                                                        </small>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </li>

                                <li className="nav-item">
                                    <span className="nav-link text-dark fw-bold">
                                        {t('navbar.welcome', { name: user.firstName })}
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/dashboard">{t('navbar.dashboard')}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">{t('navbar.profile')}</Link>
                                </li>
                                <li className="nav-item ms-2">
                                    <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                                        {t('navbar.logout')}
                                    </button>
                                </li>
                            </>
                        ) : (
                            // --- GİRİŞ YAPMAMIŞ ZİYARETÇİ MENÜSÜ ---
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
