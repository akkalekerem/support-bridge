import { useEffect, useState } from 'react'
import axios from 'axios'

export default function NotificationList({ user, onClose }) {
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        if (user && user.id) fetchNotifications()
    }, [user])

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/notifications/${user.id}`)
            setNotifications(response.data)
        } catch (error) { console.error(error) }
    }

    const markAllRead = async () => {
        try {
            await axios.put(`http://localhost:8080/api/notifications/${user.id}/read-all`)
            setNotifications(prev => prev.map(n => ({...n, read: true}))) // Hepsini okundu yap
        } catch (error) { console.error(error) }
    }

    // Bildirim tipine göre renk ve ikon
    const getTypeStyle = (type) => {
        switch (type) {
            case 'SUCCESS': return { bg: 'bg-success bg-opacity-10', icon: '🎉', border: 'border-success' }
            case 'ERROR': return { bg: 'bg-danger bg-opacity-10', icon: '❌', border: 'border-danger' }
            case 'WARNING': return { bg: 'bg-warning bg-opacity-10', icon: '⚠️', border: 'border-warning' }
            default: return { bg: 'bg-light', icon: 'ℹ️', border: 'border-secondary' }
        }
    }

    return (
        <div className="card shadow-lg position-absolute end-0 mt-2" style={{width: '350px', zIndex: 2000, maxHeight: '500px'}}>
            <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                <h6 className="mb-0 fw-bold text-primary">🔔 Bildirimler</h6>
                <div className="d-flex gap-2">
                    <button onClick={markAllRead} className="btn btn-link btn-sm text-decoration-none p-0 small">Hepsini Oku</button>
                    <button onClick={onClose} className="btn-close small"></button>
                </div>
            </div>

            <div className="list-group list-group-flush overflow-auto" style={{maxHeight: '400px'}}>
                {notifications.length === 0 ? (
                    <div className="text-center p-4 text-muted small">Henüz yeni bir bildirim yok.</div>
                ) : (
                    notifications.map(n => {
                        const style = getTypeStyle(n.type)
                        return (
                            <div key={n.id} className={`list-group-item list-group-item-action ${!n.read ? 'bg-primary bg-opacity-10' : ''}`}>
                                <div className="d-flex w-100 justify-content-between align-items-start">
                                    <span className="fs-5 me-2">{style.icon}</span>
                                    <div className="flex-grow-1">
                                        <p className="mb-1 small text-dark">{n.message}</p>
                                        <small className="text-muted" style={{fontSize: '0.7rem'}}>
                                            {new Date(n.createdAt).toLocaleString()}
                                        </small>
                                    </div>
                                    {!n.read && <span className="badge bg-primary rounded-pill p-1 ms-1" style={{fontSize: '0.5rem'}}>●</span>}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}