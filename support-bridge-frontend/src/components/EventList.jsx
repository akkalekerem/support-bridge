import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSettings } from '../context/SettingsContext' // 🔥 Context

export default function EventList({ user }) {
    const [events, setEvents] = useState([])
    const [myAppointments, setMyAppointments] = useState([])
    const [filterCity, setFilterCity] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedEvent, setSelectedEvent] = useState(null)
    const { t } = useSettings(); // 🔥 Çeviri

    useEffect(() => {
        fetchEvents()
        if(user && user.id) {
            fetchMyAppointments()
        }
    }, [user])

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/events')
            setEvents(response.data)
        } catch (error) { console.error(error) }
    }

    const fetchMyAppointments = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/appointments/volunteer/${user.id}`)
            setMyAppointments(response.data)
        } catch (error) { console.error(error) }
    }

    const handleApply = async (eventId) => {
        if (!window.confirm("Sure? / Emin misin?")) return;
        try {
            await axios.post('http://localhost:8080/api/appointments/apply', {
                volunteerId: user.id,
                eventId: eventId
            })
            alert("Success! / Başarılı! ✅")
            fetchMyAppointments()
        } catch (error) {
            alert(`Error: ${error.response?.data?.message || "Hata"}`)
        }
    }

    const hasApplied = (eventId) => {
        return myAppointments.some(app => app.event.id === eventId);
    }

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCity = filterCity ? event.city.toLowerCase() === filterCity.toLowerCase() : true;
        const isApproved = event.status === 'APPROVED';
        return matchesSearch && matchesCity && isApproved;
    })

    const cities = [...new Set(events.map(e => e.city))];
    const getCategoryImage = (category) => category === 'CELEBRATION' ? 'https://images.unsplash.com/photo-1533294160622-d5fece3e080d?auto=format&fit=crop&w=600&q=80' : 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80'

    return (
        <div>
            {/* DETAY MODALI */}
            {selectedEvent && (
                <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center" style={{zIndex: 1050}}>
                    <div className="bg-white p-4 rounded shadow-lg overflow-auto" style={{maxWidth: '600px', width: '90%', maxHeight: '90vh'}}>
                        <div className="d-flex justify-content-between align-items-start border-bottom pb-2 mb-3">
                            <h4 className="fw-bold text-primary mb-0">{selectedEvent.title}</h4>
                            <button onClick={() => setSelectedEvent(null)} className="btn-close"></button>
                        </div>

                        <img src={getCategoryImage(selectedEvent.category)} className="w-100 rounded mb-3" style={{height: '200px', objectFit: 'cover'}} />

                        <div className="mb-3">
                            <h6 className="fw-bold">{t('volunteerPanel.descTitle')}</h6>
                            <p className="text-muted">{selectedEvent.description}</p>
                        </div>

                        <div className="row g-3 mb-3 bg-light p-3 rounded">
                            <div className="col-6"><small className="fw-bold">{t('requesterPanel.labelDate')}:</small><br/>{new Date(selectedEvent.dateTime).toLocaleString()}</div>
                            <div className="col-6"><small className="fw-bold">{t('requesterPanel.labelCity')}:</small><br/>{selectedEvent.city}</div>
                            <div className="col-12"><small className="fw-bold">Address:</small><br/>{selectedEvent.address}</div>
                            <div className="col-6"><small className="fw-bold">{t('requesterPanel.labelQuota')}:</small><br/>{selectedEvent.quota >= 1000 ? t('requesterPanel.quotaUnlimited') : selectedEvent.quota}</div>
                        </div>

                        {selectedEvent.showPhoneNumber && selectedEvent.requester && selectedEvent.requester.phoneNumber ? (
                            <div className="alert alert-info d-flex align-items-center gap-2">
                                <span className="fs-4">📞</span>
                                <div>
                                    <strong>{t('volunteerPanel.contactTitle')}</strong>
                                    <div className="fs-5 fw-bold">{selectedEvent.requester.phoneNumber}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="alert alert-secondary small">
                                {t('volunteerPanel.contactHidden')}
                            </div>
                        )}

                        <div className="mt-4">
                            {hasApplied(selectedEvent.id) ? (
                                <button className="btn btn-secondary w-100 py-2" disabled>{t('volunteerPanel.alreadyApplied')}</button>
                            ) : (
                                <button onClick={() => handleApply(selectedEvent.id)} className="btn btn-success w-100 py-2 fw-bold">{t('volunteerPanel.completeApply')}</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ARAMA ALANI */}
            <div className="row g-2 mb-4">
                <div className="col-md-8">
                    <input type="text" className="form-control" placeholder={t('volunteerPanel.searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                </div>
                <div className="col-md-4">
                    <select className="form-select" value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
                        <option value="">{t('volunteerPanel.allCities')}</option>
                        {cities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                </div>
            </div>

            <div className="row g-4">
                {filteredEvents.length === 0 ? <div className="text-center text-muted py-5">{t('volunteerPanel.noResult')}</div> :
                    filteredEvents.map(event => {
                        const applied = hasApplied(event.id);

                        return (
                            <div key={event.id} className="col-md-6 col-lg-4">
                                <div className="card h-100 shadow-sm border-0 hover-shadow transition-all">
                                    <div className="position-relative" style={{cursor: 'pointer'}} onClick={() => setSelectedEvent(event)}>
                                        <img src={getCategoryImage(event.category)} className="card-img-top" style={{height: '180px', objectFit: 'cover'}}
                                             onError={(e) => {e.target.onerror=null; e.target.src="https://placehold.co/600x400"}}/>
                                        <div className="position-absolute top-0 end-0 m-2 badge bg-dark bg-opacity-75">
                                            {event.quota >= 1000 ? t('requesterPanel.quotaUnlimited') : `${t('requesterPanel.labelQuota')}: ${event.quota}`}
                                        </div>
                                    </div>

                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title fw-bold text-dark text-truncate" style={{cursor: 'pointer'}} onClick={() => setSelectedEvent(event)}>{event.title}</h5>
                                        <p className="card-text text-muted small">{event.description.substring(0, 80)}...</p>

                                        <div className="mt-auto">
                                            <div className="d-flex justify-content-between text-secondary small mb-3 bg-light p-2 rounded">
                                                <span>📅 {new Date(event.dateTime).toLocaleDateString()}</span>
                                                <span>📍 {event.city}</span>
                                            </div>

                                            <div className="d-flex gap-2">
                                                <button onClick={() => setSelectedEvent(event)} className="btn btn-outline-primary w-50 btn-sm">{t('volunteerPanel.btnDetails')}</button>

                                                {applied ? (
                                                    <button className="btn btn-secondary w-50 btn-sm" disabled>{t('volunteerPanel.btnApplied')}</button>
                                                ) : (
                                                    <button onClick={() => handleApply(event.id)} className="btn btn-primary w-50 btn-sm fw-bold">{t('volunteerPanel.btnApply')}</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
            </div>
        </div>
    )
}