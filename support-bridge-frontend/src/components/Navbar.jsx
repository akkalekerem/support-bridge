import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useTranslation();

    // LocalStorage'dan kullanıcıyı kontrol et
    const user = JSON.parse(localStorage.getItem('user'))

    // Çıkış yapma fonksiyonu
    const handleLogout = () => {
        localStorage.removeItem('user')
        navigate('/')
        window.location.reload() // Menüyü yenilemek için sayfayı yenile
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
