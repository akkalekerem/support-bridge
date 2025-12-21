import { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminPanel({ user }) {
    const [activeTab, setActiveTab] = useState('events') // 'events' or 'users'
    const [requesters, setRequesters] = useState([])

    // Sayfa açılınca bekleyenleri ve kullanıcıları çek
    useEffect(() => {
        fetchPendingEvents()
        fetchRequesters()
    }, [])

    const fetchPendingEvents = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/admin/events/pending')
            setPendingEvents(response.data)
            setLoading(false)
        } catch (error) {
            console.error("Etkinlikler çekilemedi", error)
            setLoading(false)
        }
    }

    const fetchRequesters = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/admin/requesters')
            setRequesters(response.data)
        } catch (error) {
            console.error("Kullanıcılar çekilemedi", error)
        }
    }

    // Onaylama / Reddetme İşlemi
    const handleDecision = async (eventId, decision) => {
        try {
            await axios.put(`http://localhost:8080/api/admin/events/${eventId}/${decision}`)
            alert(`İşlem Başarılı: Etkinlik ${decision === 'approve' ? 'Onaylandı' : 'Reddedildi'} ✅`)
            fetchPendingEvents() // Listeyi yenile
        } catch (error) {
            alert("İşlem sırasında hata oluştu.")
        }
    }

    // --- AYNI GÖRSEL MANTIĞI (Tutarlılık İçin) ---
    const getCategoryImage = (category) => {
        if (category === 'CELEBRATION') {
            return 'https://images.unsplash.com/photo-1533294160622-d5fece3e080d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        }
        return 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = "https://placehold.co/600x400/orange/white?text=Admin+Panel";
    }

    if (loading) return (
        <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    )

    return (
        <div className="container">
            {/* BAŞLIK ALANI */}
            <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                <div>
                    <h3 className="fw-bold text-dark mb-0">🛡️ Yönetici Kontrol Merkezi</h3>
                    <p className="text-muted mb-0">Platform yönetim paneli.</p>
                </div>
            </div>

            {/* TAB MENU */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'events' ? 'active fw-bold' : ''}`}
                        onClick={() => setActiveTab('events')}
                    >
                        📅 Onay Bekleyen Etkinlikler ({pendingEvents.length})
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'users' ? 'active fw-bold' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        👥 Yardım İsteyen Listesi
                    </button>
                </li>
            </ul>

            {/* İÇERİK: ETKİNLİKLER */}
            {activeTab === 'events' && (
                <>
                    {pendingEvents.length === 0 ? (
                        <div className="text-center p-5 bg-white rounded shadow-sm border">
                            <div className="display-1 mb-3">🎉</div>
                            <h4 className="fw-bold text-success">Harika! Bekleyen İş Yok.</h4>
                            <p className="text-muted">Tüm etkinlikler incelendi, şu an sistem güncel.</p>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {pendingEvents.map(event => (
                                <div key={event.id} className="col-md-6 col-lg-4">
                                    <div className="card h-100 shadow-sm border-0 hover-shadow transition-all">
                                        <div className="position-relative" style={{ height: '180px' }}>
                                            <img
                                                src={getCategoryImage(event.category)}
                                                className="w-100 h-100"
                                                style={{ objectFit: 'cover' }}
                                                onError={handleImageError}
                                            />
                                            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-25"></div>
                                            <span className="position-absolute top-0 end-0 m-2 badge bg-warning text-dark shadow-sm">
                                                ⏳ Onay Bekliyor
                                            </span>
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title fw-bold text-truncate">{event.title}</h5>
                                            <h6 className="card-subtitle mb-3 text-muted small">
                                                Talep Eden: <span className="text-primary">{event.requester?.firstName} {event.requester?.lastName}</span>
                                            </h6>
                                            <p className="card-text text-muted small">
                                                {event.description.length > 80 ? event.description.substring(0, 80) + '...' : event.description}
                                            </p>
                                            <div className="bg-light p-2 rounded small mb-3">
                                                <div>📅 {new Date(event.dateTime).toLocaleString('tr-TR')}</div>
                                                <div>📍 {event.city}</div>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button
                                                    onClick={() => handleDecision(event.id, 'approve')}
                                                    className="btn btn-success flex-grow-1 fw-bold shadow-sm"
                                                >
                                                    ✔ Yayına Al
                                                </button>
                                                <button
                                                    onClick={() => handleDecision(event.id, 'reject')}
                                                    className="btn btn-outline-danger flex-grow-1 fw-bold"
                                                >
                                                    ✖ Reddet
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* İÇERİK: KULLANICILAR */}
            {activeTab === 'users' && (
                <div className="card shadow-sm border-0">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Ad Soyad</th>
                                        <th>Email</th>
                                        <th>Durum</th>
                                        <th>Belge</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requesters.map(req => (
                                        <tr key={req.id}>
                                            <td className="fw-bold">{req.firstName} {req.lastName}</td>
                                            <td>{req.email}</td>
                                            <td>
                                                <span className={`badge bg-${req.verificationStatus === 'APPROVED' ? 'success' : 'warning'}`}>
                                                    {req.verificationStatus || 'Bilinmiyor'}
                                                </span>
                                            </td>
                                            <td>
                                                {req.documentPath ? (
                                                    <a
                                                        href={`http://localhost:8080/api/upload/${req.documentPath.split('/').pop()}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        📄 Belgeyi Görüntüle
                                                    </a>
                                                ) : (
                                                    <span className="text-muted small">Belge Yok</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}