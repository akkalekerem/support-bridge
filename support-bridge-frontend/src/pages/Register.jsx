import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useSettings } from '../context/SettingsContext' // 🔥 Context

export default function Register() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { t } = useSettings(); // 🔥 Çeviri

    const roleParam = searchParams.get('role') || 'VOLUNTEER'

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '',
        phoneNumber: '', role: roleParam, experienceNote: ''
    })

    const [selectedFile, setSelectedFile] = useState(null)
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        setFormData(prev => ({ ...prev, role: roleParam }))
    }, [roleParam])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = new FormData()
        data.append('request', new Blob([JSON.stringify(formData)], { type: 'application/json' }));

        if (roleParam === 'REQUESTER' && selectedFile) {
            data.append('file', selectedFile)
        }

        try {
            await axios.post('http://localhost:8080/api/auth/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            alert("Success! / Başarılı! ✅")
            navigate('/login')
        } catch (error) {
            alert(`Error / Hata: ${error.response?.data?.message || "Hata oluştu"}`)
        }
    }

    const isVolunteer = roleParam === 'VOLUNTEER';
    const bgImage = isVolunteer
        ? 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        : 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                <div className="col-md-5 d-none d-md-block p-0" style={{backgroundImage: `url("${bgImage}")`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                    <div className="h-100 d-flex align-items-end p-5" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'}}>
                        <div className="text-white">
                            <h2 className="fw-bold display-6">{isVolunteer ? t('register.heroVolunteerTitle') : t('register.heroRequesterTitle')}</h2>
                            <p className="lead opacity-75">{isVolunteer ? t('register.heroVolunteerText') : t('register.heroRequesterText')}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-7 h-100 bg-white overflow-auto">
                    <div className="d-flex align-items-center justify-content-center min-vh-100 py-5">
                        <div style={{ maxWidth: '550px', width: '100%' }} className="p-4">
                            <h3 className="fw-bold mb-4">{isVolunteer ? t('register.formVolunteerTitle') : t('register.formRequesterTitle')}</h3>

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-sm-6">
                                        <label className="small fw-bold text-secondary">{t('register.nameLabel')}</label>
                                        <input type="text" name="firstName" className="form-control bg-light border-0 p-3" onChange={handleChange} required />
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="small fw-bold text-secondary">{t('register.lastNameLabel')}</label>
                                        <input type="text" name="lastName" className="form-control bg-light border-0 p-3" onChange={handleChange} required />
                                    </div>
                                    <div className="col-12">
                                        <label className="small fw-bold text-secondary">{t('register.emailLabel')}</label>
                                        <input type="email" name="email" className="form-control bg-light border-0 p-3" onChange={handleChange} required />
                                    </div>

                                    <div className="col-sm-6">
                                        <label className="small fw-bold text-secondary">{t('register.passwordLabel')}</label>
                                        <div className="input-group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                className="form-control bg-light border-0 p-3"
                                                onChange={handleChange}
                                                required
                                            />
                                            <button type="button" className="btn btn-light border-0" onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? "🙈" : "👁️"}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <label className="small fw-bold text-secondary">{t('register.phoneLabel')}</label>
                                        <input type="text" name="phoneNumber" className="form-control bg-light border-0 p-3" onChange={handleChange} required placeholder="5XX..." />
                                    </div>

                                    {isVolunteer ? (
                                        <div className="col-12">
                                            <label className="small fw-bold text-secondary">{t('register.expLabel')}</label>
                                            <textarea name="experienceNote" className="form-control bg-light border-0 p-3" rows="3" onChange={handleChange}></textarea>
                                        </div>
                                    ) : (
                                        <div className="col-12">
                                            <label className="small fw-bold text-danger">{t('register.pdfLabel')}</label>
                                            <input type="file" accept=".pdf" className="form-control bg-light border-0 p-3" onChange={(e) => setSelectedFile(e.target.files[0])} required />
                                        </div>
                                    )}
                                </div>
                                <button type="submit" className="btn btn-success w-100 py-3 mt-4 fw-bold shadow-sm">{t('register.btnSubmit')}</button>
                            </form>
                            <div className="text-center mt-3">
                                <Link to="/login" className="text-decoration-none fw-bold">{t('register.hasAccount')} {t('register.linkLogin')}</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}