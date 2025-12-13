import { useEffect, useState } from 'react'
import axios from 'axios'

export default function EventList({ user }) {
    const [events, setEvents] = useState([])
    const [filterCity, setFilterCity] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/events')
            setEvents(response.data)
        } catch (error) {
            console.error("Etkinlikler yüklenemedi", error)
        }
    }

    const handleApply = async (eventId) => {
        if (!window.confirm("Bu etkinliğe başvurmak istediğine emin misin?")) return;

        try {
            await axios.post('http://localhost:8080/api/appointments/apply', {
                volunteerId: user.id,
                eventId: eventId
            })
            // YENİ MESAJ BURADA
            alert("Başvurun başarıyla alındı! Durumunu 'Başvurularım' sekmesinden takip edebilirsin. ✅")
            window.location.reload()
        } catch (error) {
            alert(`Başvuru başarısız: ${error.response?.data?.message || error.message}`)
        }
    }

    // FİLTRELEME MANTIĞI (Arama + Şehir)
    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCity = filterCity ? event.city.toLowerCase() === filterCity.toLowerCase() : true;
        // Sadece ONAYLI etkinlikleri göster
        const isApproved = event.status === 'APPROVED';

        return matchesSearch && matchesCity && isApproved;
    })

    // Benzersiz şehirleri bul (Filtre kutusu için)
    const cities = [...new Set(events.map(e => e.city))];

    const getCategoryImage = (category) => category === 'CELEBRATION' ? 'https://images.unsplash.com/photo-1533294160622-d5fece3e080d?auto=format&fit=crop&w=600&q=80' : 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80'

    return (
        <div>
            {/* ARAMA VE FİLTRE ALANI */}
            <div className="row g-2 mb-4">
                <div className="col-md-8">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="🔍 Etkinlik ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <select className="form-select" value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
                        <option value="">Tüm Şehirler</option>
                        {cities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                </div>
            </div>

            <div className="row g-4">
                {filteredEvents.length === 0 ? <div className="text-center text-muted py-5">Aradığınız kriterlere uygun etkinlik bulunamadı.</div> :
                    filteredEvents.map(event => (
                        <div key={event.id} className="col-md-6 col-lg-4">
                            <div className="card h-100 shadow-sm border-0 hover-shadow transition-all">
                                <img src={getCategoryImage(event.category)} className="card-img-top" style={{height: '180px', objectFit: 'cover'}}
                                     onError={(e) => {e.target.onerror=null; e.target.src="https://placehold.co/600x400"}}/>
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title fw-bold text-dark">{event.title}</h5>
                                    <p className="card-text text-muted small">{event.description.substring(0, 80)}...</p>

                                    <div className="mt-auto">
                                        <div className="d-flex justify-content-between text-secondary small mb-3 bg-light p-2 rounded">
                                            <span>📅 {new Date(event.dateTime).toLocaleDateString()}</span>
                                            <span>📍 {event.city}</span>
                                        </div>
                                        <button onClick={() => handleApply(event.id)} className="btn btn-primary w-100 fw-bold shadow-sm">
                                            Gönüllü Ol ✋
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}