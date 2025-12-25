import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RequesterPanel from '../components/RequesterPanel'
import EventList from '../components/EventList'
import AdminPanel from '../components/AdminPanel' // 🔥 Admin Panelini çağırdık
import MyAppointments from '../components/MyAppointments'
import { useSettings } from '../context/SettingsContext'

export default function Dashboard() {
    const [user, setUser] = useState(null)
    const [activeTab, setActiveTab] = useState('events')
    const navigate = useNavigate()
    const { t } = useSettings();

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (!storedUser) {
            navigate('/login')
        } else {
            setUser(JSON.parse(storedUser))
        }
    }, [])

    if (!user) return null

    // 1. DURUM: ADMİN GELDİYSE 👑
    if (user.role === 'ADMIN') {
        return <AdminPanel />
    }

    // 2. DURUM: TALEP EDEN GELDİYSE 🤝
    if (user.role === 'REQUESTER') {
        return (
            <div className="container mt-4">
                <div className="bg-white p-4 rounded shadow-sm mb-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h2 className="fw-bold text-primary mb-1">{t('dashboard.title')}</h2>
                        <p className="text-muted mb-0">{t('dashboard.welcomeMsg')}, {user.firstName} {user.lastName}</p>
                    </div>
                    <span className="badge bg-primary px-3 py-2 fs-6 rounded-pill">
                    {t('dashboard.roleRequester')}
                </span>
                </div>
                <RequesterPanel user={user} />
            </div>
        )
    }

    // 3. DURUM: HİÇBİRİ DEĞİLSE GÖNÜLLÜDÜR 🦸‍♂️
    return (
        <div className="container mt-4">
            <div className="bg-white p-4 rounded shadow-sm mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold text-primary mb-1">{t('dashboard.title')}</h2>
                    <p className="text-muted mb-0">{t('dashboard.welcomeMsg')}, {user.firstName} {user.lastName}</p>
                </div>
                <span className="badge bg-success px-3 py-2 fs-6 rounded-pill">
            👨‍🚀 {t('dashboard.roleVolunteer')}
        </span>
            </div>

            <div className="bg-white p-4 rounded shadow-sm min-vh-100">
                <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                        <button
                            className={`nav-link fw-bold ${activeTab === 'events' ? 'active text-primary' : 'text-secondary'}`}
                            onClick={() => setActiveTab('events')}
                        >
                            🌎 {t('dashboard.tabEvents')}
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link fw-bold ${activeTab === 'appointments' ? 'active text-primary' : 'text-secondary'}`}
                            onClick={() => setActiveTab('appointments')}
                        >
                            📂 {t('dashboard.tabApps')}
                        </button>
                    </li>
                </ul>

                {activeTab === 'events' ? <EventList user={user} /> : <MyAppointments user={user} />}
            </div>
        </div>
    )
}