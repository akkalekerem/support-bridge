import { useEffect, useState } from 'react'
import { useSettings } from '../context/SettingsContext' // 🔥 Context bağlantısı

export default function Profile() {
    const [user, setUser] = useState(null)
    const { t, lang } = useSettings() // 🔥 Çeviri fonksiyonu ve dil bilgisi

    useEffect(() => {
        // Bilgileri yerel hafızadan çekiyoruz
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
    }, [])

    if (!user) return <div className="text-center mt-5">Loading...</div>

    // Rol isimlendirmesi (Çeviriye uygun)
    const getRoleName = () => {
        if (user.role === 'ADMIN') return "Admin";
        if (user.role === 'VOLUNTEER') return t('dashboard.roleVolunteer');
        return t('dashboard.roleRequester');
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow border-0">
                        {/* ÜST RENKLİ KISIM */}
                        <div className={`card-header text-white text-center py-4 ${
                            user.role === 'ADMIN' ? 'bg-danger' :
                                user.role === 'VOLUNTEER' ? 'bg-success' : 'bg-primary'
                        }`}>
                            <div className="display-4 mb-2">
                                {user.role === 'ADMIN' ? '🛡️' : user.role === 'VOLUNTEER' ? '🦸‍♂️' : '🤝'}
                            </div>
                            <h3 className="mb-0">{user.firstName} {user.lastName}</h3>
                            <span className="badge bg-light text-dark mt-2">
                                {getRoleName()}
                            </span>
                        </div>

                        {/* BİLGİLER */}
                        <div className="card-body p-4">
                            <h5 className="text-muted mb-4 border-bottom pb-2">
                                {t('profilePage.title') || 'Profil Bilgilerim'}
                            </h5>

                            <div className="mb-3 row">
                                <label className="col-sm-4 col-form-label fw-bold">
                                    {t('profilePage.email') || 'Email'}:
                                </label>
                                <div className="col-sm-8">
                                    <input type="text" readOnly className="form-control-plaintext" value={user.email} />
                                </div>
                            </div>

                            <div className="mb-3 row">
                                <label className="col-sm-4 col-form-label fw-bold">
                                    {t('profilePage.phone') || 'Telefon'}:
                                </label>
                                <div className="col-sm-8">
                                    <input type="text" readOnly className="form-control-plaintext" value={user.phoneNumber || '-'} />
                                </div>
                            </div>

                            {/* ROL ÖZEL BİLGİLERİ */}
                            {user.role === 'VOLUNTEER' && (
                                <div className="mb-3 row">
                                    <label className="col-sm-4 col-form-label fw-bold">
                                        {t('register.expLabel') || 'Tecrübe Notu'}:
                                    </label>
                                    <div className="col-sm-8">
                                        <p className="text-muted fst-italic">{user.experienceNote || '-'}</p>
                                    </div>
                                </div>
                            )}

                            {user.role === 'REQUESTER' && (
                                <div className="mb-3 row">
                                    <label className="col-sm-4 col-form-label fw-bold">
                                        {t('register.pdfLabel') || 'Dosya'}:
                                    </label>
                                    <div className="col-sm-8">
                                        <p className="text-muted fst-italic">{user.documentPath || '-'}</p>
                                    </div>
                                </div>
                            )}

                            {/* Uyarı Mesajı (Pratik olsun diye burada dille kontrol ettim) */}
                            <div className="alert alert-info mt-4 small">
                                <i className="bi bi-info-circle"></i> {lang === 'en'
                                ? "Please contact the system administrator to update your information or change your password."
                                : "Bilgilerinizi güncellemek veya şifre değiştirmek için lütfen sistem yöneticisi ile iletişime geçiniz."}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}