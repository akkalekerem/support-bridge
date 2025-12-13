import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()

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

                        {user ? (
                            // --- GİRİŞ YAPMIŞ KULLANICI MENÜSÜ ---
                            <>
                                <li className="nav-item">
                  <span className="nav-link text-dark fw-bold">
                    Merhaba, {user.firstName}
                  </span>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">Profilim</Link>
                                </li>
                                <li className="nav-item ms-2">
                                    <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                                        Çıkış Yap
                                    </button>
                                </li>
                            </>
                        ) : (
                            // --- GİRİŞ YAPMAMIŞ ZİYARETÇİ MENÜSÜ ---
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">Anasayfa</Link>
                                </li>
                                <li className="nav-item ms-2">
                                    <Link className="btn btn-outline-primary btn-sm" to="/login">Giriş Yap</Link>
                                </li>
                                <li className="nav-item ms-2">
                                    <Link className="btn btn-primary btn-sm" to="/register">Kayıt Ol</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}