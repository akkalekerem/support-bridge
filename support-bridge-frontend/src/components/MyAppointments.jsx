import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSettings } from '../context/SettingsContext'
import ChatWindow from './ChatWindow'

export default function MyAppointments({ user }) {
    const [appointments, setAppointments] = useState([])
    const { t } = useSettings()
    const [activeChat, setActiveChat] = useState(null)

    useEffect(() => {
        if(user && user.id) fetchAppointments()
    }, [user])

    const fetchAppointments = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/appointments/volunteer/${user.id}`)
            setAppointments(response.data)
        } catch (error) { console.error(error) }
    }

    const startChat = (app) => {
        setActiveChat({
            appointmentId: app.id,
            otherUserId: app.event.requester.id,
            otherUserName: `${app.event.requester.firstName} ${app.event.requester.lastName}`
        })
    }

    const getStatusBadge = (status) => {
        if(status === 'APPROVED') return <span className="badge bg-success">{t('requesterPanel.badgeApproved') || 'Onaylandı'}</span>
        if(status === 'REJECTED') return <span className="badge bg-danger">{t('requesterPanel.badgeRejected') || 'Reddedildi'}</span>
        return <span className="badge bg-warning text-dark">{t('requesterPanel.badgePending') || 'Bekliyor'}</span>
    }

    if (activeChat) {
        return (
            <div>
                <button onClick={() => setActiveChat(null)} className="btn btn-outline-secondary mb-3">← {t('dashboard.tabApps') || 'Geri'}</button>
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
        <div className="row g-4">
            {appointments.length === 0 ? (
                <div className="text-center text-muted py-5">
                    <h5>📭</h5>
                    <p>{t('volunteerPanel.noResult') || 'Henüz bir başvurunuz yok.'}</p>
                </div>
            ) : (
                appointments.map(app => (
                    <div key={app.id} className="col-md-6 col-lg-4">
                        <div className="card shadow-sm h-100 border-0">
                            <div className="card-header bg-white border-0 fw-bold text-primary">
                                {new Date(app.event.dateTime).toLocaleDateString()}
                            </div>
                            <div className="card-body">
                                <h5 className="card-title fw-bold">{app.event.title}</h5>
                                <p className="text-muted small mb-2">📍 {app.event.city}</p>
                                <p className="small text-secondary">{app.event.description.substring(0, 60)}...</p>

                                <div className="d-flex justify-content-between align-items-center mt-4">
                                    {getStatusBadge(app.status)}

                                    {app.status === 'APPROVED' && (
                                        <button onClick={() => startChat(app)} className="btn btn-primary btn-sm">
                                            💬 {t('requesterPanel.btnMessage') || 'Mesaj'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}