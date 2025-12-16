import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

export default function Profile() {
    const [user, setUser] = useState(null)
    const { t } = useTranslation();

    useEffect(() => {
        // Bilgileri yerel hafızadan çekiyoruz
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
    }, [])

    if (!user) return <div className="text-center mt-5">{t('profile.loading')}</div>

    const getRoleName = (role) => {
        switch (role) {
            case 'ADMIN': return t('roles.admin');
            case 'VOLUNTEER': return t('roles.volunteer');
            case 'REQUESTER': return t('roles.requester');
            default: return role;
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow border-0">
                        {/* ÜST RENKLİ KISIM */}
                        <div className={`card-header text-white text-center py-4 ${user.role === 'ADMIN' ? 'bg-danger' :
                                user.role === 'VOLUNTEER' ? 'bg-success' : 'bg-primary'
                            }`}>
                            <div className="display-4 mb-2">
                                {user.role === 'ADMIN' ? '🛡️' : user.role === 'VOLUNTEER' ? '🦸‍♂️' : '🤝'}
                            </div>
                            <h3 className="mb-0">{user.firstName} {user.lastName}</h3>
                            <span className="badge bg-light text-dark mt-2">
                                {getRoleName(user.role)}
                            </span>
                        </div>

                        {/* BİLGİLER */}
                        <div className="card-body p-4">
                            <h5 className="text-muted mb-4 border-bottom pb-2">{t('profile.personal_info')}</h5>

                            <div className="mb-3 row">
                                <label className="col-sm-4 col-form-label fw-bold">{t('profile.email')}</label>
                                <div className="col-sm-8">
                                    <input type="text" readOnly className="form-control-plaintext" value={user.email} />
                                </div>
                            </div>

                            <div className="mb-3 row">
                                <label className="col-sm-4 col-form-label fw-bold">{t('profile.phone')}</label>
                                <div className="col-sm-8">
                                    <input type="text" readOnly className="form-control-plaintext" value={user.phoneNumber || '-'} />
                                </div>
                            </div>

                            {/* ROL ÖZEL BİLGİLERİ */}
                            {user.role === 'VOLUNTEER' && (
                                <div className="mb-3 row">
                                    <label className="col-sm-4 col-form-label fw-bold">{t('profile.exp_note')}</label>
                                    <div className="col-sm-8">
                                        <p className="text-muted fst-italic">{user.experienceNote || t('profile.not_entered')}</p>
                                    </div>
                                </div>
                            )}

                            {user.role === 'REQUESTER' && (
                                <div className="mb-3 row">
                                    <label className="col-sm-4 col-form-label fw-bold">{t('profile.document')}</label>
                                    <div className="col-sm-8">
                                        <p className="text-muted fst-italic">{user.documentPath || t('profile.not_uploaded')}</p>
                                    </div>
                                </div>
                            )}

                            <div className="alert alert-info mt-4 small">
                                <i className="bi bi-info-circle"></i> {t('profile.info_alert')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
