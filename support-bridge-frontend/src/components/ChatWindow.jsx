import { useEffect, useState, useRef } from 'react'
import axios from 'axios'

export default function ChatWindow({ currentUser, otherUserId, otherUserName, appointmentId, onClose }) {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const messagesEndRef = useRef(null)

    useEffect(() => {
        fetchMessages()
        const interval = setInterval(fetchMessages, 2000)
        return () => clearInterval(interval)
    }, [appointmentId])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/messages/${appointmentId}`)
            setMessages(response.data)
        } catch (error) {
            console.error("Mesajlar çekilemedi", error)
        }
    }

    const handleSend = async (e) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        const messagePayload = {
            senderId: currentUser.id,
            receiverId: otherUserId, // Backend bunu kullanmıyor ama Request sınıfı istiyorsa dursun, zararı yok
            appointmentId: appointmentId,
            content: newMessage
        }

        try {
            await axios.post(`http://localhost:8080/api/messages`, messagePayload)
            setNewMessage("")
            fetchMessages()
        } catch (error) {
            alert("Mesaj gönderilemedi!")
        }
    }

    return (
        <div className="card shadow-lg border-0" style={{ height: '500px' }}>

            {/* BAŞLIK */}
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3">
                <div className="d-flex align-items-center">
                    <div className="bg-white text-primary rounded-circle d-flex justify-content-center align-items-center fw-bold me-2" style={{width: '35px', height: '35px'}}>
                        {otherUserName ? otherUserName.charAt(0).toUpperCase() : '?'}
                    </div>
                    <h6 className="mb-0 fw-bold">{otherUserName || "Sohbet"}</h6>
                </div>
                <button onClick={onClose} className="btn btn-sm btn-outline-light">Kapat ✖</button>
            </div>

            {/* MESAJ LİSTESİ */}
            <div className="card-body overflow-auto bg-light" style={{ flex: 1 }}>
                {messages.length === 0 ? (
                    <div className="text-center text-muted mt-5">
                        <p>Henüz mesaj yok. Merhaba de! 👋</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        // DİKKAT: Backend artık 'sender' nesnesi döndüğü için id'ye msg.sender.id diye ulaşıyoruz
                        const isMe = msg.sender.id === currentUser.id

                        return (
                            <div key={index} className={`d-flex mb-2 ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                                <div
                                    className={`p-3 rounded-4 shadow-sm ${isMe ? 'bg-primary text-white' : 'bg-white text-dark'}`}
                                    style={{
                                        maxWidth: '75%',
                                        borderBottomRightRadius: isMe ? '0' : '1rem',
                                        borderBottomLeftRadius: isMe ? '1rem' : '0'
                                    }}
                                >
                                    <div className="mb-1">{msg.content}</div>
                                    <small className={`d-block text-end ${isMe ? 'text-white-50' : 'text-muted'}`} style={{fontSize: '0.65rem'}}>
                                        {/* DİKKAT: Backend 'sentAt' gönderiyor, 'timestamp' değil */}
                                        {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                    </small>
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="card-footer bg-white border-top p-3">
                <form onSubmit={handleSend} className="d-flex gap-2">
                    <input
                        type="text"
                        className="form-control border-0 bg-light"
                        placeholder="Mesajınızı yazın..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary rounded-circle" style={{width: '45px', height: '45px'}}>
                        ➤
                    </button>
                </form>
            </div>
        </div>
    )
}