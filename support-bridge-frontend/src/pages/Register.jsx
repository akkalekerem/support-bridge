import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

export default function Register() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const roleParam = searchParams.get('role') || 'VOLUNTEER'

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '', phoneNumber: '',
        role: roleParam, experienceNote: '', documentPath: ''
    })

    useEffect(() => {
        setFormData(prev => ({ ...prev, role: roleParam }))
    }, [roleParam])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:8080/api/auth/register', formData)
            alert("Kayıt Başarılı! Şimdi giriş yapabilirsiniz.")
            navigate('/login')
        } catch (error) {
            alert("Kayıt başarısız! Bilgileri kontrol edin.")
        }
    }

    // Rol bazlı görsel ve metin ayarları
    const isVolunteer = roleParam === 'VOLUNTEER';
    const bgImage = isVolunteer
        ? 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' // Gönüllü fotosu
        : 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'; // Destek fotosu

    const titleText = isVolunteer ? "Kahramanımız Olun" : "Yanınızdayız";
    const subText = isVolunteer
        ? "Topluluğumuza katılarak dünyayı değiştirmeye bugünden başlayın."
        : "İhtiyaçlarınızı paylaşın, gönüllülerimiz size ulaşsın.";

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
                    <div className="h-100 d-flex align-items-end p-5" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'}}>
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
                                    {isVolunteer ? '🦸‍♂️ Gönüllü Hesabı Oluştur' : '🤝 Destek Hesabı Oluştur'}
                                </h3>
                                <p className="text-muted">Formu doldurarak aramıza katılın.</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-sm-6">
                                        <label className="form-label small fw-bold text-secondary">AD</label>
                                        <input type="text" name="firstName" className="form-control bg-light border-0" onChange={handleChange} required />
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="form-label small fw-bold text-secondary">SOYAD</label>
                                        <input type="text" name="lastName" className="form-control bg-light border-0" onChange={handleChange} required />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label small fw-bold text-secondary">EMAIL</label>
                                        <input type="email" name="email" className="form-control bg-light border-0" onChange={handleChange} required />
                                    </div>

                                    <div className="col-sm-6">
                                        <label className="form-label small fw-bold text-secondary">ŞİFRE</label>
                                        <input type="password" name="password" className="form-control bg-light border-0" onChange={handleChange} required />
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="form-label small fw-bold text-secondary">TELEFON</label>
                                        <input type="text" name="phoneNumber" className="form-control bg-light border-0" onChange={handleChange} required />
                                    </div>

                                    {/* ROL ÖZEL ALANLAR */}
                                    {isVolunteer && (
                                        <div className="col-12">
                                            <label className="form-label small fw-bold text-secondary">GÖNÜLLÜLÜK TECRÜBENİZ</label>
                                            <textarea name="experienceNote" className="form-control bg-light border-0" rows="3" onChange={handleChange} placeholder="Daha önce neler yaptınız?"></textarea>
                                        </div>
                                    )}

                                    {!isVolunteer && (
                                        <div className="col-12">
                                            <label className="form-label small fw-bold text-secondary">DURUM BELGESİ (URL)</label>
                                            <input type="text" name="documentPath" className="form-control bg-light border-0" onChange={handleChange} placeholder="Google Drive linki vb." />
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <button type="submit" className="btn btn-success btn-lg w-100 shadow-sm">
                                        Kaydı Tamamla
                                    </button>
                                </div>
                            </form>

                            <div className="text-center mt-4">
                                <small>Zaten hesabınız var mı? <Link to="/login" className="fw-bold text-success text-decoration-none">Giriş Yap</Link></small>
                                <br/>
                                <Link to="/" className="small text-muted text-decoration-none mt-2 d-inline-block">← Anasayfaya Dön</Link>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}