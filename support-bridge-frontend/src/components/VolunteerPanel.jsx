import { useEffect, useState } from 'react'
import axios from 'axios'
import EventList from './EventList'
import ChatWindow from './ChatWindow'

export default function VolunteerPanel({ user }) {
    const [myAppointments, setMyAppointments] = useState([])
    const [activeChat, setActiveChat] = useState(null)
    const [activeTab, setActiveTab] = useState('events')

    useEffect(() => {
        fetchMyAppointments()
    }, [])

    const fetchMyAppointments = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/appointments/volunteer/${user.id}`)
            setMyAppointments(response.data)
        } catch (error) { console.error("Başvurular çekilemedi", error) }
    }

    const openChat = (app) => {
        setActiveChat({
            appointmentId: app.id,
            otherUserId: app.event.requester.id,
            otherUserName: `${app.event.requester.firstName} ${app.event.requester.lastName}`
        })
    }

    const getCategoryImage = (category) => category === 'CELEBRATION' ? 'https://images.unsplash.com/photo-1533294160622-d5fece3e080d?auto=format&fit=crop&w=600&q=80' : 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80'

    return (
        <div className="container">
            <ul className="nav nav-tabs mb-4 border-bottom-0">
                <li className="nav-item">
                    <button className={`nav-link px-4 fw-bold ${activeTab === 'events' ? 'active text-primary' : 'text-muted'}`}
                            onClick={() => { setActiveTab('events'); setActiveChat(null); }}>🌎 Tüm Etkinlikler</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link px-4 fw-bold ${activeTab === 'my-apps' ? 'active text-primary' : 'text-muted'}`}
                            onClick={() => { setActiveTab('my-apps'); setActiveChat(null); }}>📂 Başvurularım</button>
                </li>
            </ul>

            <div className="bg-white p-4 rounded shadow-sm border">
                {activeTab === 'events' && <EventList user={user} myAppointments={myAppointments} />}

                {activeTab === 'my-apps' && (
                    <div>
                        {activeChat ? (
                            <div>
                                <button onClick={() => setActiveChat(null)} className="btn btn-outline-secondary btn-sm mb-3">← Listeye Dön</button>
                                <ChatWindow
                                    currentUser={user}
                                    otherUserId={activeChat.otherUserId}
                                    otherUserName={activeChat.otherUserName}
                                    appointmentId={activeChat.appointmentId}
                                    onClose={() => setActiveChat(null)}
                                />
                            </div>
                        ) : (
                            <div className="row g-4">
                                {myAppointments.length === 0 ? <div className="text-center py-5 text-muted"><h4>Başvurun yok.</h4></div> :
                                    myAppointments.map(app => (
                                        <div key={app.id} className="col-md-6 col-lg-4">
                                            <div className="card h-100 shadow-sm border-0 hover-shadow transition-all">
                                                <div className="position-relative" style={{ height: '160px' }}>
                                                    <img src={getCategoryImage(app.event.category)} className="w-100 h-100" style={{ objectFit: 'cover' }}
                                                         onError={(e) => {e.target.onerror=null; e.target.src="https://placehold.co/600x400"}}/>
                                                    <div className="position-absolute top-0 end-0 m-2">
                                                        {app.status === 'APPROVED' ? <span className="badge bg-success shadow-sm">✔ Onaylandı</span> :
                                                            app.status === 'REJECTED' ? <span className="badge bg-danger shadow-sm">✖ Reddedildi</span> :
                                                                <span className="badge bg-warning text-dark shadow-sm">⏳ Bekleniyor</span>}
                                                    </div>
                                                </div>

                                                <div className="card-body">
                                                    <h5 className="fw-bold">{app.event.title}</h5>
                                                    <p className="text-muted small">{app.event.description.substring(0, 80)}...</p>

                                                    <div className="small text-secondary bg-light p-2 rounded mb-3">
                                                        <div>📅 Etkinlik: {new Date(app.event.dateTime).toLocaleDateString()}</div>
                                                        <div>📍 {app.event.city}</div>
                                                        {/* BAŞVURU ZAMANI BURADA */}
                                                        <div className="text-muted border-top mt-1 pt-1" style={{fontSize: '0.75rem'}}>
                                                            🕒 Başvuru: {app.appliedAt ? new Date(app.appliedAt).toLocaleString() : '-'}
                                                        </div>
                                                    </div>

                                                    {app.status === 'APPROVED' ? (
                                                        <button onClick={() => openChat(app)} className="btn btn-success w-100 btn-sm fw-bold shadow-sm">
                                                            💬 Mesajlaş
                                                        </button>
                                                    ) : (
                                                        <button className="btn btn-secondary w-100 btn-sm" disabled>Sonuç Bekleniyor</button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}