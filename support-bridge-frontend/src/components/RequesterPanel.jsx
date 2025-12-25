import { useEffect, useState } from 'react'
import axios from 'axios'
import ChatWindow from './ChatWindow'
import { useSettings } from '../context/SettingsContext' // 🔥 Context

export default function RequesterPanel({ user }) {
    const [events, setEvents] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [activeChat, setActiveChat] = useState(null)
    const { t } = useSettings(); // 🔥 Çeviri

    const [newEvent, setNewEvent] = useState({
        title: '', description: '', dateTime: '',
        city: 'İstanbul', address: '',
        quota: 1, showPhoneNumber: false,
        category: 'SUPPORT', subType: 'Moral'
    })

    const [applicantsMap, setApplicantsMap] = useState({})
    const [loadingApplicants, setLoadingApplicants] = useState({})
    const [selectedVolunteer, setSelectedVolunteer] = useState(null)

    const citiesList = [
        "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
    ].sort();

    useEffect(() => {
        if (user && user.id) fetchMyEvents()
    }, [user])

    const fetchMyEvents = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/events/requester/${user.id}`)
            setEvents(response.data)
        } catch (error) { console.error(error) }
    }

    const toggleApplicants = async (eventId) => {
        if (applicantsMap[eventId]) {
            const newMap = { ...applicantsMap }; delete newMap[eventId]; setApplicantsMap(newMap); return
        }
        setLoadingApplicants(prev => ({ ...prev, [eventId]: true }))
        try {
            const response = await axios.get(`http://localhost:8080/api/appointments/event/${eventId}`)
            setApplicantsMap(prev => ({ ...prev, [eventId]: response.data }))
        } catch (error) { } finally { setLoadingApplicants(prev => ({ ...prev, [eventId]: false })) }
    }

    const handleCreate = async (e) => {
        e.preventDefault()
        if (!user?.id) return alert("Oturum hatası.")
        try {
            const formattedDateTime = newEvent.dateTime.length === 16 ? newEvent.dateTime + ":00" : newEvent.dateTime;
            await axios.post(`http://localhost:8080/api/events?requesterId=${user.id}`, { ...newEvent, dateTime: formattedDateTime })
            alert(t('requesterPanel.badgePending')); setShowForm(false); fetchMyEvents()
        } catch (error) { alert("Hata oluştu.") }
    }

    const handleDecision = async (appointmentId, decision) => {
        if(!window.confirm("Emin misin? / Are you sure?")) return;
        try {
            const endpoint = decision === 'approve' ? 'approve' : 'reject';
            await axios.put(`http://localhost:8080/api/appointments/${appointmentId}/${endpoint}`)
            window.location.reload()
        } catch (error) {
            alert("Hata / Error")
        }
    }

    const startChat = (appointment) => {
        setActiveChat({
            appointmentId: appointment.id,
            otherUserId: appointment.volunteer.id,
            otherUserName: `${appointment.volunteer.firstName} ${appointment.volunteer.lastName}`
        })
    }

    const getCategoryImage = (cat) => cat === 'CELEBRATION' ? 'https://images.unsplash.com/photo-1533294160622-d5fece3e080d?auto=format&fit=crop&w=600&q=80' : 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80'
    const now = new Date().toISOString().slice(0, 16);

    const getStatusBadge = (status) => {
        if(status === 'APPROVED') return <span className="position-absolute top-0 start-0 m-2 badge bg-success shadow-sm">{t('requesterPanel.badgeApproved')}</span>
        if(status === 'REJECTED') return <span className="position-absolute top-0 start-0 m-2 badge bg-danger shadow-sm">{t('requesterPanel.badgeRejected')}</span>
        return <span className="position-absolute top-0 start-0 m-2 badge bg-warning text-dark shadow-sm">{t('requesterPanel.badgePending')}</span>
    }

    if (activeChat) {
        return (
            <div className="container mt-4">
                <button onClick={() => setActiveChat(null)} className="btn btn-outline-secondary mb-3">← {t('requesterPanel.title')}</button>
                <ChatWindow currentUser={user} otherUserId={activeChat.otherUserId} otherUserName={activeChat.otherUserName} appointmentId={activeChat.appointmentId} onClose={() => setActiveChat(null)} />
            </div>
        )
    }

    return (
        <div className="container">
            {/* Gönüllü Detay Modalı */}
            {selectedVolunteer && (
                <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center" style={{zIndex: 1050}}>
                    <div className="bg-white p-4 rounded shadow-lg" style={{maxWidth: '500px', width: '90%'}}>
                        <h5 className="fw-bold border-bottom pb-2">ℹ️ Info</h5>
                        <p><strong>{t('register.nameLabel')}:</strong> {selectedVolunteer.firstName} {selectedVolunteer.lastName}</p>
                        <p><strong>{t('register.emailLabel')}:</strong> {selectedVolunteer.email}</p>
                        <div className="bg-light p-3 rounded mt-3">
                            <strong>📝 {t('register.expLabel')}:</strong>
                            <p className="mb-0 mt-1 small fst-italic">{selectedVolunteer.experienceNote || "-"}</p>
                        </div>
                        <button onClick={() => setSelectedVolunteer(null)} className="btn btn-secondary w-100 mt-3">Close</button>
                    </div>
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">{t('requesterPanel.title')}</h3>
                <button onClick={() => setShowForm(!showForm)} className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'} shadow-sm fw-bold`}>
                    {showForm ? t('requesterPanel.btnCancel') : t('requesterPanel.btnNew')}
                </button>
            </div>

            {showForm && (
                <div className="card shadow-sm border-0 mb-5 bg-light p-4">
                    <h5 className="text-primary mb-3">{t('requesterPanel.formTitle')}</h5>
                    <form onSubmit={handleCreate}>
                        <div className="row g-3">
                            <div className="col-md-6"><input placeholder={t('requesterPanel.placeholderTitle')} className="form-control" required onChange={e => setNewEvent({...newEvent, title: e.target.value})} /></div>
                            <div className="col-md-3"><select className="form-select" onChange={e => setNewEvent({...newEvent, category: e.target.value})}><option value="SUPPORT">Destek</option><option value="CELEBRATION">Kutlama</option></select></div>
                            <div className="col-md-3"><input placeholder={t('requesterPanel.placeholderType')} className="form-control" required onChange={e => setNewEvent({...newEvent, subType: e.target.value})} /></div>
                            <div className="col-12"><textarea placeholder={t('requesterPanel.placeholderDesc')} className="form-control" required onChange={e => setNewEvent({...newEvent, description: e.target.value})} /></div>

                            <div className="col-md-4">
                                <label className="form-label small fw-bold">{t('requesterPanel.labelCity')}</label>
                                <select className="form-select" value={newEvent.city} onChange={e => setNewEvent({...newEvent, city: e.target.value})}>
                                    {citiesList.map(city => <option key={city} value={city}>{city}</option>)}
                                </select>
                            </div>

                            <div className="col-md-8">
                                <label className="form-label small fw-bold">Adres</label>
                                <input placeholder={t('requesterPanel.placeholderAddr')} className="form-control" required onChange={e => setNewEvent({...newEvent, address: e.target.value})} />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label small fw-bold">{t('requesterPanel.labelDate')}</label>
                                <input type="datetime-local" className="form-control" min={now} required onChange={e => setNewEvent({...newEvent, dateTime: e.target.value})} />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label small fw-bold">{t('requesterPanel.labelQuota')}</label>
                                <select className="form-select" value={newEvent.quota} onChange={e => setNewEvent({...newEvent, quota: parseInt(e.target.value)})}>
                                    {[1,2,3,4,5,10,15,20,25,40,50,70,100].map(num => <option key={num} value={num}>{num} {t('requesterPanel.quotaPerson')}</option>)}
                                    <option value="1000">{t('requesterPanel.quotaUnlimited')}</option>
                                </select>
                            </div>

                            <div className="col-md-4 d-flex align-items-end">
                                <div className="form-check mb-2">
                                    <input className="form-check-input" type="checkbox" id="showPhone"
                                           checked={newEvent.showPhoneNumber}
                                           onChange={e => setNewEvent({...newEvent, showPhoneNumber: e.target.checked})} />
                                    <label className="form-check-label small" htmlFor="showPhone">
                                        {t('requesterPanel.labelShowPhone')}
                                    </label>
                                </div>
                            </div>

                            <div className="col-12 text-end"><button type="submit" className="btn btn-success px-4">{t('requesterPanel.btnSave')}</button></div>
                        </div>
                    </form>
                </div>
            )}

            <div className="row g-4">
                {events.map(event => (
                    <div key={event.id} className="col-lg-6">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="row g-0 h-100">
                                <div className="col-md-4 position-relative">
                                    <img src={getCategoryImage(event.category)} className="img-fluid rounded-start h-100 w-100" style={{objectFit: 'cover', minHeight: '200px'}}
                                         onError={(e) => {e.target.onerror=null; e.target.src="https://placehold.co/600x400"}}/>

                                    {getStatusBadge(event.status)}

                                    <span className="position-absolute bottom-0 start-0 m-2 badge bg-dark bg-opacity-75">
                        {event.quota >= 1000 ? t('requesterPanel.quotaUnlimited') : `${t('requesterPanel.labelQuota')}: ${event.quota}`}
                    </span>
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5 className="fw-bold">{event.title}</h5>
                                        <p className="small text-muted mb-2">{event.description.substring(0,50)}...</p>
                                        <small className="d-block mb-2">📍 {event.city}</small>

                                        <button onClick={() => toggleApplicants(event.id)} className="btn btn-outline-primary btn-sm w-100">
                                            {applicantsMap[event.id] ? `${t('requesterPanel.btnHide')} ▲` : `${t('requesterPanel.btnApplicants')} ▼`}
                                        </button>

                                        {applicantsMap[event.id] && (
                                            <div className="mt-2 bg-light p-2 rounded" style={{maxHeight: '200px', overflowY: 'auto'}}>
                                                {applicantsMap[event.id].length === 0 ? <small className="text-muted">{t('requesterPanel.noApplicants')}</small> :
                                                    applicantsMap[event.id].map(app => (
                                                        <div key={app.id} className="mb-2 bg-white p-2 rounded shadow-sm border">
                                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <strong className="small">{app.volunteer.firstName} {app.volunteer.lastName}</strong>
                                                                    <button onClick={() => setSelectedVolunteer(app.volunteer)} className="btn btn-sm btn-info text-white py-0 px-2 rounded-circle fw-bold" title="Detay">i</button>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex gap-1 mt-2">
                                                                {app.status === 'PENDING' ? (
                                                                    <>
                                                                        <button onClick={() => handleDecision(app.id, 'approve')} className="btn btn-success btn-sm flex-grow-1 py-0" style={{fontSize: '0.75rem'}}>{t('requesterPanel.btnApprove')}</button>
                                                                        <button onClick={() => handleDecision(app.id, 'reject')} className="btn btn-outline-danger btn-sm flex-grow-1 py-0" style={{fontSize: '0.75rem'}}>{t('requesterPanel.btnReject')}</button>
                                                                    </>
                                                                ) : app.status === 'APPROVED' ? (
                                                                    <button onClick={() => startChat(app)} className="btn btn-primary btn-sm w-100 py-0">{t('requesterPanel.btnMessage')}</button>
                                                                ) : (
                                                                    <span className="badge bg-danger w-100">{t('requesterPanel.badgeRejected')}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}