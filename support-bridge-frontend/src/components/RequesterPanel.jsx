import { useEffect, useState } from 'react'
import axios from 'axios'
import ChatWindow from './ChatWindow'

export default function RequesterPanel({ user }) {
    const [events, setEvents] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [activeChat, setActiveChat] = useState(null)

    const [newEvent, setNewEvent] = useState({
        title: '', description: '', dateTime: '',
        city: '', address: '', quota: 1,
        category: 'SUPPORT', subType: 'Moral'
    })

    const [applicantsMap, setApplicantsMap] = useState({})
    const [loadingApplicants, setLoadingApplicants] = useState({})

    // Gönüllü Detaylarını Göstermek İçin State
    const [selectedVolunteer, setSelectedVolunteer] = useState(null)

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
            alert("Etkinlik oluşturuldu! ⏳"); setShowForm(false); fetchMyEvents()
        } catch (error) { alert("Hata oluştu.") }
    }

    // ONAY / RED FONKSİYONU
    const handleDecision = async (appointmentId, decision) => {
        if(!window.confirm(`Bu başvuruyu ${decision === 'approve' ? 'ONAYLAMAK' : 'REDDETMEK'} istediğine emin misin?`)) return;
        try {
            // decision 'approve' ise onayla, 'reject' ise reddet
            const endpoint = decision === 'approve' ? 'approve' : 'reject';
            await axios.put(`http://localhost:8080/api/appointments/${appointmentId}/${endpoint}`)
            alert(`İşlem başarılı: ${decision === 'approve' ? 'Onaylandı ✅' : 'Reddedildi ❌'}`)

            // Sayfayı yenilemeden listeyi güncellemek için:
            window.location.reload()
        } catch (error) { alert("İşlem başarısız.") }
    }

    const startChat = (appointment) => {
        setActiveChat({
            appointmentId: appointment.id,
            otherUserId: appointment.volunteer.id,
            otherUserName: `${appointment.volunteer.firstName} ${appointment.volunteer.lastName}`
        })
    }

    const getCategoryImage = (cat) => cat === 'CELEBRATION' ? 'https://images.unsplash.com/photo-1533294160622-d5fece3e080d?auto=format&fit=crop&w=600&q=80' : 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80'

    // Şu anki zaman (Input min değeri için - Geçmiş tarih seçilemez)
    const now = new Date().toISOString().slice(0, 16);

    if (activeChat) {
        return (
            <div className="container mt-4">
                <button onClick={() => setActiveChat(null)} className="btn btn-outline-secondary mb-3">← Taleplerime Dön</button>
                <ChatWindow
                    currentUser={user}
                    otherUserId={activeChat.otherUserId}
                    otherUserName={activeChat.otherUserName}
                    appointmentId={activeChat.appointmentId}
                    onClose={() => setActiveChat(null)}
                />
            </div>
        )
    }

    return (
        <div className="container">

            {/* GÖNÜLLÜ DETAY MODALI (Info'ya basınca açılır) */}
            {selectedVolunteer && (
                <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center" style={{zIndex: 1050}}>
                    <div className="bg-white p-4 rounded shadow-lg" style={{maxWidth: '500px', width: '90%'}}>
                        <h5 className="fw-bold border-bottom pb-2">ℹ️ Gönüllü Bilgileri</h5>
                        <p><strong>Ad Soyad:</strong> {selectedVolunteer.firstName} {selectedVolunteer.lastName}</p>
                        <p><strong>E-posta:</strong> {selectedVolunteer.email}</p>
                        {/* Eğer telefon entity'de yoksa göstermez */}
                        {selectedVolunteer.phoneNumber && <p><strong>Telefon:</strong> {selectedVolunteer.phoneNumber}</p>}

                        <div className="bg-light p-3 rounded mt-3">
                            <strong>📝 Deneyim / Hakkında:</strong>
                            <p className="mb-0 mt-1 small fst-italic">{selectedVolunteer.experienceNote || "Not eklenmemiş."}</p>
                        </div>
                        <button onClick={() => setSelectedVolunteer(null)} className="btn btn-secondary w-100 mt-3">Kapat</button>
                    </div>
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-dark fw-bold mb-0">📂 Taleplerim</h3>
                <button onClick={() => setShowForm(!showForm)} className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'} shadow-sm fw-bold`}>
                    {showForm ? 'Vazgeç' : '+ Yeni Talep Oluştur'}
                </button>
            </div>

            {showForm && (
                <div className="card shadow-sm border-0 mb-5 bg-light p-4">
                    <h5 className="text-primary mb-3">📝 Yeni Etkinlik</h5>
                    <form onSubmit={handleCreate}>
                        <div className="row g-3">
                            <div className="col-md-6"><input placeholder="Başlık" className="form-control" required onChange={e => setNewEvent({...newEvent, title: e.target.value})} /></div>
                            <div className="col-md-3"><select className="form-select" onChange={e => setNewEvent({...newEvent, category: e.target.value})}><option value="SUPPORT">Destek</option><option value="CELEBRATION">Kutlama</option></select></div>
                            <div className="col-md-3"><input placeholder="Alt Tür" className="form-control" required onChange={e => setNewEvent({...newEvent, subType: e.target.value})} /></div>
                            <div className="col-12"><textarea placeholder="Açıklama" className="form-control" required onChange={e => setNewEvent({...newEvent, description: e.target.value})} /></div>
                            <div className="col-md-4"><input placeholder="Şehir" className="form-control" required onChange={e => setNewEvent({...newEvent, city: e.target.value})} /></div>
                            <div className="col-md-8"><input placeholder="Adres" className="form-control" required onChange={e => setNewEvent({...newEvent, address: e.target.value})} /></div>

                            {/* TARİH KISITLAMASI BURADA */}
                            <div className="col-md-6">
                                <label className="form-label small fw-bold">Tarih</label>
                                <input type="datetime-local" className="form-control" min={now} required onChange={e => setNewEvent({...newEvent, dateTime: e.target.value})} />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label small fw-bold">Kontenjan</label>
                                <input type="number" className="form-control" required onChange={e => setNewEvent({...newEvent, quota: e.target.value})} />
                            </div>
                            <div className="col-12 text-end"><button type="submit" className="btn btn-success">Kaydet</button></div>
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
                                    <span className="position-absolute top-0 start-0 m-2 badge bg-light text-dark shadow-sm">{event.status === 'APPROVED' ? 'Yayında' : 'Bekliyor'}</span>
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5 className="fw-bold">{event.title}</h5>
                                        <p className="small text-muted">{event.description.substring(0,50)}...</p>

                                        <button onClick={() => toggleApplicants(event.id)} className="btn btn-outline-primary btn-sm w-100">
                                            {applicantsMap[event.id] ? 'Gizle ▲' : 'Başvurular ▼'}
                                        </button>

                                        {applicantsMap[event.id] && (
                                            <div className="mt-2 bg-light p-2 rounded">
                                                {applicantsMap[event.id].length === 0 ? <small className="text-muted">Başvuru yok.</small> :
                                                    applicantsMap[event.id].map(app => (
                                                        <div key={app.id} className="mb-2 bg-white p-2 rounded shadow-sm border">
                                                            <div className="d-flex justify-content-between align-items-center mb-1 border-bottom pb-1">
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <strong className="small">{app.volunteer.firstName} {app.volunteer.lastName}</strong>
                                                                    {/* INFO BUTONU */}
                                                                    <button onClick={() => setSelectedVolunteer(app.volunteer)} className="btn btn-sm btn-info text-white py-0 px-2 rounded-circle fw-bold" title="Bilgileri Gör">i</button>
                                                                </div>
                                                                {/* BAŞVURU ZAMANI */}
                                                                <span className="badge bg-secondary" style={{fontSize: '0.65rem'}}>
                                    {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Yeni'}
                                </span>
                                                            </div>

                                                            <div className="d-flex gap-1 mt-2">
                                                                {app.status === 'PENDING' ? (
                                                                    <>
                                                                        <button onClick={() => handleDecision(app.id, 'approve')} className="btn btn-success btn-sm flex-grow-1 py-0" style={{fontSize: '0.75rem'}}>Onayla</button>
                                                                        <button onClick={() => handleDecision(app.id, 'reject')} className="btn btn-outline-danger btn-sm flex-grow-1 py-0" style={{fontSize: '0.75rem'}}>Reddet</button>
                                                                    </>
                                                                ) : app.status === 'APPROVED' ? (
                                                                    <button onClick={() => startChat(app)} className="btn btn-primary btn-sm w-100 py-0">💬 Mesaj</button>
                                                                ) : (
                                                                    <span className="badge bg-danger w-100">Reddedildi</span>
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