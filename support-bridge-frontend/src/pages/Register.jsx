import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useTranslation } from 'react-i18next';

export default function Register() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { t } = useTranslation();

    const roleParam = searchParams.get('role') || 'VOLUNTEER'

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '', phoneNumber: '',
        role: roleParam, experienceNote: '', documentPath: ''
    })

    const [showPassword, setShowPassword] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        setFormData(prev => ({ ...prev, role: roleParam }))
    }, [roleParam])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);

        setUploading(true);
        try {
            const response = await axios.post('http://localhost:8080/api/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Gelen dosya yolunu kaydet
            setFormData({ ...formData, documentPath: response.data });
        } catch (error) {
            console.error("Dosya yükleme hatası", error);
            alert("Dosya yüklenemedi!");
        } finally {
            setUploading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:8080/api/auth/register', formData)
            alert(t('register.success'))
            navigate('/login')
        } catch (error) {
            alert(t('register.error'))
        }
    }

    // Rol bazlı görsel ve metin ayarları
    const isVolunteer = roleParam === 'VOLUNTEER';
    const bgImage = isVolunteer
        ? 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' // Gönüllü fotosu
        : 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'; // Destek fotosu

    const titleText = isVolunteer ? t('register.volunteer_title') : t('register.requester_title');
    const subText = isVolunteer
        ? t('register.volunteer_sub')
        : t('register.requester_sub');

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">

                {/* SOL TARA: GÖRSEL ALAN */}
                <div
                    className="col-md-5 d-none d-md-block p-0"
                    style={{
                        backgroundImage: `url("${bgImage}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="h-100 d-flex align-items-end p-5" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                        <div className="text-white">
                            <h2 className="fw-bold display-6">{titleText}</h2>
                            <p className="lead opacity-75">{subText}</p>
                        </div>
                    </div>
                </div>

                {/* SAĞ TARAF: KAYIT FORMU (Scrollable eğer ekran küçükse) */}
                <div className="col-md-7 h-100 bg-white overflow-auto">
                    <div className="d-flex align-items-center justify-content-center min-vh-100 py-5">
                        <div style={{ maxWidth: '550px', width: '100%' }} className="p-4">

                            <div className="mb-4">
                                <h3 className="fw-bold text-dark">
                                    {isVolunteer ? t('register.create_vol_account') : t('register.create_req_account')}
                                </h3>
                                <p className="text-muted">{t('register.join_us')}</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-sm-6">
                                        <label className="form-label small fw-bold text-secondary">{t('register.label_name')}</label>
                                        <input type="text" name="firstName" className="form-control bg-light border-0" onChange={handleChange} required />
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="form-label small fw-bold text-secondary">{t('register.label_surname')}</label>
                                        <input type="text" name="lastName" className="form-control bg-light border-0" onChange={handleChange} required />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label small fw-bold text-secondary">{t('register.label_email')}</label>
                                        <input type="email" name="email" className="form-control bg-light border-0" onChange={handleChange} required />
                                    </div>

                                    <div className="col-sm-6">
                                        <label className="form-label small fw-bold text-secondary">{t('register.label_password')}</label>
                                        <div className="input-group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                className="form-control bg-light border-0"
                                                onChange={handleChange}
                                                required
                                            />
                                            <button
                                                className="btn btn-light"
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? "🙈" : "👁️"}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="form-label small fw-bold text-secondary">{t('register.label_phone')}</label>
                                        <input type="text" name="phoneNumber" className="form-control bg-light border-0" onChange={handleChange} required />
                                    </div>

                                    {/* ROL ÖZEL ALANLAR */}
                                    {isVolunteer && (
                                        <div className="col-12">
                                            <label className="form-label small fw-bold text-secondary">{t('register.label_exp')}</label>
                                            <textarea name="experienceNote" className="form-control bg-light border-0" rows="3" onChange={handleChange} placeholder="Daha önce neler yaptınız?"></textarea>
                                        </div>
                                    )}

                                    {!isVolunteer && (
                                        <div className="col-12">
                                            <label className="form-label small fw-bold text-secondary">{t('register.label_doc')}</label>
                                            {/* Dosya Yükleme Inputu */}
                                            <input
                                                type="file"
                                                className="form-control bg-light border-0"
                                                onChange={handleFileUpload}
                                            />
                                            {uploading && <div className="text-info small mt-1">Yükleniyor...</div>}
                                            {formData.documentPath && <div className="text-success small mt-1">Dosya yüklendi! ✅</div>}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <button type="submit" className="btn btn-success btn-lg w-100 shadow-sm">
                                        {t('register.submit')}
                                    </button>
                                </div>
                            </form>

                            <div className="text-center mt-4">
                                <small>{t('register.have_account')} <Link to="/login" className="fw-bold text-success text-decoration-none">{t('register.login')}</Link></small>
                                <br />
                                <Link to="/" className="small text-muted text-decoration-none mt-2 d-inline-block">{t('login.back_home')}</Link>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
