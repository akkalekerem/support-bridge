import { useEffect, useState } from 'react'
import axios from 'axios'

export default function EventList({ user, myAppointments = [] }) {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/events')
            setEvents(response.data)
            setLoading(false)
        } catch (error) {
            console.error("Hata:", error)
            setLoading(false)
        }
    }

    const handleApply = async (eventId) => {
        if (!window.confirm("Bu etkinliğe başvurmak istediğine emin misin?")) return;

        try {
            await axios.post('http://localhost:8080/api/appointments/apply', {
                volunteerId: user.id,
                eventId: eventId
            })
            alert("Başvurun başarıyla alındı! Durumunu yukarıdan takip edebilirsin. ✅")
            window.location.reload()
        } catch (error) {
            alert("Başvuru sırasında bir hata oluştu. ❌")
        }
    }

    // --- RESİM SEÇME MANTIĞI (GARANTİLİ) ---
    const getCategoryImage = (category) => {
        if (category === 'CELEBRATION') {
            // Yeni Link: Daha güvenilir bir kutlama görseli
            return 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80'
        }
        // Destek Görseli (Zaten çalışıyor)
        return 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }

    // --- YEDEK RESİM (Eğer yukarıdakiler açılmazsa bu devreye girer) ---
    const handleImageError = (e) => {
        e.target.onerror = null; // Sonsuz döngüyü engeller
        // Renkli, üzerinde "Resim Yok" yazan basit bir kutu resmi
        e.target.src = "https://placehold.co/600x400/orange/white?text=Kutlama+Gorseli";
    }

    if (loading) return (
        <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
            </div>
        </div>
    )

    return (
        <div className="container">
            {events.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    <h3>📭 Henüz Aktif Etkinlik Yok</h3>
                    <p>Şu an açık bir talep bulunmuyor, lütfen daha sonra tekrar kontrol et.</p>
                </div>
            ) : (
                <div className="row g-4">
                    {events.map((event) => {
                        const isApplied = myAppointments.some(app => app.event.id === event.id)

                        return (
                            <div key={event.id} className="col-md-6 col-lg-4">
                                <div className="card h-100 shadow-sm border-0 overflow-hidden hover-shadow hover-effect transition-all">

                                    {/* KART GÖRSEL ALANI */}
                                    <div className="position-relative bg-light" style={{ height: '180px' }}>
                                        <img
                                            src={getCategoryImage(event.category)}
                                            alt={event.category}
                                            className="w-100 h-100"
                                            style={{ objectFit: 'cover' }}
                                            onError={handleImageError} // Hata olursa yedek devreye girer
                                        />

                                        {/* Sağ üst köşe kategori etiketi */}
                                        <span className={`position-absolute top-0 end-0 m-2 badge rounded-pill ${event.category === 'SUPPORT' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {event.category === 'SUPPORT' ? '🤝 Destek' : '🎉 Kutlama'}
                    </span>
                                    </div>

                                    <div className="card-body d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h5 className="card-title fw-bold text-dark mb-0 text-truncate" title={event.title}>
                                                {event.title}
                                            </h5>
                                        </div>

                                        <h6 className="text-primary small mb-3">
                                            <i className="bi bi-tag-fill me-1"></i>{event.subType}
                                        </h6>

                                        <p className="card-text text-muted small flex-grow-1">
                                            {event.description.length > 100 ? event.description.substring(0, 100) + '...' : event.description}
                                        </p>

                                        <div className="bg-light p-2 rounded mb-3 small text-secondary">
                                            <div className="mb-1">📍 <strong>{event.city}</strong>, {event.address}</div>
                                            <div>📅 {new Date(event.dateTime).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                                        </div>

                                        {/* ALT KISIM: Kontenjan ve Buton */}
                                        <div className="d-flex justify-content-between align-items-center mt-2">
                                            <small className="text-muted fw-bold">
                                                👥 Kontenjan: {event.quota}
                                            </small>

                                            {isApplied ? (
                                                <button className="btn btn-secondary btn-sm px-3 rounded-pill" disabled>
                                                    ✅ Başvuruldu
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleApply(event.id)}
                                                    className="btn btn-primary btn-sm px-4 rounded-pill fw-bold shadow-sm"
                                                >
                                                    Başvur ✋
                                                </button>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}