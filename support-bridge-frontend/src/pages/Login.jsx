import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useSettings } from '../context/SettingsContext' // 🔥 Context

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const { t } = useSettings(); // 🔥 Çeviri fonksiyonunu al

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', formData)
            localStorage.setItem('user', JSON.stringify(response.data))
            window.location.href = "/dashboard"
        } catch (error) {
            alert(t('login.alertError'))
        }
    }

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                {/* SOL TARA: GÖRSEL ALAN */}
                <div
                    className="col-md-6 d-none d-md-block p-0"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="h-100 d-flex align-items-end p-5" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'}}>
                        <div className="text-white">
                            <h2 className="fw-bold">{t('login.heroTitle')}</h2>
                            <p className="lead">{t('login.heroText')}</p>
                        </div>
                    </div>
                </div>

                {/* SAĞ TARAF: FORM ALANI */}
                <div className="col-md-6 d-flex align-items-center justify-content-center bg-white">
                    <div style={{ maxWidth: '400px', width: '100%' }} className="p-4">
                        <div className="text-center mb-4">
                            <h3 className="fw-bold text-primary">{t('login.welcomeTitle')}</h3>
                            <p className="text-muted">{t('login.welcomeSub')}</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-bold small text-secondary">{t('login.emailLabel')}</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control form-control-lg bg-light border-0"
                                    onChange={handleChange}
                                    required
                                    placeholder="ornek@email.com"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold small text-secondary">{t('login.passwordLabel')}</label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className="form-control form-control-lg bg-light border-0"
                                        onChange={handleChange}
                                        required
                                        placeholder="******"
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-light border-0"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{zIndex: 0}}
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg w-100 mb-3 shadow-sm">
                                {t('login.btnSubmit')}
                            </button>
                        </form>

                        <div className="text-center mt-3">
                            <p className="text-muted">
                                {t('login.noAccount')} <Link to="/register" className="fw-bold text-primary text-decoration-none">{t('login.linkRegister')}</Link>
                            </p>
                            <Link to="/" className="small text-muted text-decoration-none">{t('login.linkHome')}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}