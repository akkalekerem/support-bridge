import AdminPanel from '../components/AdminPanel'
import RequesterPanel from '../components/RequesterPanel'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import VolunteerPanel from '../components/VolunteerPanel'
import EventForm from '../components/EventForm' // Talep Eden için form (YENİ EKLENDİ)

export default function Dashboard() {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        // 1. Tarayıcı hafızasından giriş yapan kullanıcıyı oku
        const loggedInUser = localStorage.getItem('user')

        if (loggedInUser) {
            // Kullanıcı varsa bilgileri al
            setUser(JSON.parse(loggedInUser))
        } else {
            // Kullanıcı yoksa (giriş yapmadan linke tıkladıysa) Login'e şutla
            navigate('/')
        }
    }, [navigate])

    // Çıkış Yapma Fonksiyonu
    const handleLogout = () => {
        localStorage.removeItem('user') // Hafızayı temizle
        navigate('/') // Login ekranına gönder
    }

    // Kullanıcı bilgisi yüklenene kadar bekle
    if (!user) return null

    return (
        <div className="container mt-5">

            {/* ÜST BİLGİ KUTUSU (Çıkış butonu yok, sadece kimlik bilgisi var) */}
            <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded shadow-sm">
                <div>
                    <h2 className="text-primary mb-0">Kontrol Paneli</h2>
                    <p className="text-muted mb-0">Hoşgeldin, {user.firstName} {user.lastName}</p>
                </div>

                <div>
                    {/* ROL ROZETİ (Burada kalmalı ki kullanıcı rolünü bilsin) */}
                    <span className={`badge fs-6 px-3 py-2 ${
                        user.role === 'ADMIN' ? 'bg-danger' :
                            user.role === 'VOLUNTEER' ? 'bg-success' : 'bg-secondary'
                    }`}>
            {user.role === 'ADMIN' ? '🛡️ Yönetici' :
                user.role === 'VOLUNTEER' ? '🦸‍♂️ Gönüllü' : '🤝 Talep Eden'}
          </span>
                </div>
            </div>


            {/* İçerik Alanı: Role Göre Değişecek */}
            <div className="row">
                <div className="col-12">
                    {/* Kartın içindeki padding'i kaldırdık ki form ve liste daha rahat otursun */}
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-0">
                            {user.role === 'ADMIN' ? (
                                <div className="p-4"><AdminPanel user={user} /></div>
                            ) : user.role === 'VOLUNTEER' ? (
                                <div className="p-4"><VolunteerPanel user={user} /></div>
                            ) : (
                                <div className="p-4"><RequesterPanel user={user} /></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}