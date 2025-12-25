import { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminPanel() {
    const [events, setEvents] = useState([])

    useEffect(() => {
        fetchPendingEvents()
    }, [])

    // ARTIK DİREKT BEKLEYENLERİ ÇEKİYORUZ (Yeni Controller'dan)
    const fetchPendingEvents = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/admin/events/pending')
            setEvents(response.data)
        } catch (error) {
            console.error("Veriler çekilemedi", error)
        }
    }

    const handleApprove = async (id) => {
        if(!window.confirm("Bu etkinliği yayınlamak istiyor musun?")) return;
        try {
            // Yeni Admin Endpoint'i
            await axios.put(`http://localhost:8080/api/admin/events/${id}/approve`)
            alert("Etkinlik onaylandı ve yayına alındı! ✅")
            fetchPendingEvents() // Listeyi yenile
        } catch (error) {
            alert("Hata oluştu: " + (error.response?.data || "Bilinmiyor"))
        }
    }

    const handleDelete = async (id) => {
        if(!window.confirm("Bu etkinliği reddetmek istiyor musun?")) return;
        try {
            // Yeni Admin Endpoint'i
            await axios.put(`http://localhost:8080/api/admin/events/${id}/reject`)
            alert("Etkinlik reddedildi. ❌")
            fetchPendingEvents() // Listeyi yenile
        } catch (error) {
            alert("Hata oluştu")
        }
    }

    const getPdfUrl = (path) => {
        if (!path) return "#";
        const cleanPath = path.replace(/\\/g, '/');
        return `http://localhost:8080/${cleanPath}`;
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>🛡️ Admin Yönetim Paneli</h2>
                <span className="badge bg-warning text-dark fs-6">
            Bekleyen Onay: {events.length}
        </span>
            </div>

            {events.length === 0 ? (
                <div className="alert alert-success text-center p-5">
                    <h4>Harika! 🎉</h4>
                    <p>Şu an onay bekleyen yeni bir etkinlik yok.</p>
                </div>
            ) : (
                <div className="row g-4">
                    {events.map(event => (
                        <div key={event.id} className="col-lg-6">
                            <div className="card shadow border-warning border-2">
                                <div className="card-header bg-warning bg-opacity-25 fw-bold d-flex justify-content-between">
                                    <span>⏳ Onay Bekliyor</span>
                                    <small>{new Date(event.createdAt || Date.now()).toLocaleDateString()}</small>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">{event.title}</h5>
                                    <p className="card-text">{event.description}</p>

                                    <div className="bg-light p-3 rounded mb-3">
                                        <div className="d-flex justify-content-between">
                                            <strong>👤 Talep Eden:</strong>
                                            <span>{event.requester?.firstName} {event.requester?.lastName}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mt-1">
                                            <strong>📄 Durum Belgesi:</strong>
                                            {event.requester?.documentPath ? (
                                                <a href={getPdfUrl(event.requester.documentPath)} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-danger fw-bold">
                                                    PDF İncele 👁️
                                                </a>
                                            ) : (
                                                <span className="text-muted">Yok</span>
                                            )}
                                        </div>
                                        <div className="d-flex justify-content-between mt-1">
                                            <strong>📍 Şehir:</strong>
                                            <span>{event.city}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mt-1">
                                            <strong>📞 Telefon İzni:</strong>
                                            <span>{event.showPhoneNumber ? "✅ Var" : "❌ Yok"}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mt-1">
                                            <strong>👥 Kontenjan:</strong>
                                            <span>{event.quota >= 1000 ? "Sınırsız" : event.quota}</span>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button onClick={() => handleApprove(event.id)} className="btn btn-success flex-grow-1 fw-bold">
                                            ✅ ONAYLA
                                        </button>
                                        <button onClick={() => handleDelete(event.id)} className="btn btn-outline-danger flex-grow-1">
                                            ❌ REDDET
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}