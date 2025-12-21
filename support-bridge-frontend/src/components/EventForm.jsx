import { useState, useEffect } from 'react'
import axios from 'axios'

export default function EventForm({ user }) {
    // Form verilerini tutacak state'ler
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'SUPPORT', // Varsayılan: Destek
        subType: '',
        dateTime: '',
        city: '',
        address: '',
        quota: 1
    })

    const [message, setMessage] = useState({ text: '', type: '' })
    const [cities, setCities] = useState([])

    useEffect(() => {
        // Şehirleri çek
        const fetchCities = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/public/cities')
                setCities(response.data)
            } catch (error) {
                console.error("Şehirler yüklenemedi:", error)
            }
        }
        fetchCities()
    }, [])

    // Kutucuklara yazılanları state'e aktar
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    // Bugünü "YYYY-MM-DDTHH:MM" formatına çevirir (Input için gerekli format)
    const getCurrentDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };
    // Gönder butonuna basılınca
    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage({ text: '', type: '' })

        try {
            // Backend'e gönderilecek veriyi hazırla
            const eventToSend = {
                ...formData,
                requesterId: user.id // Giriş yapan kişinin ID'si
            }

            // API isteği at (POST)
            await axios.post('http://localhost:8080/api/events/create', eventToSend)

            // Başarılı olursa formu temizle ve mesaj ver
            setMessage({ text: 'Etkinlik başarıyla oluşturuldu ve onaya gönderildi! ✅', type: 'success' })
            setFormData({
                title: '',
                description: '',
                category: 'SUPPORT',
                subType: '',
                dateTime: '',
                city: '',
                address: '',
                quota: 1
            })

        } catch (error) {
            console.error(error)
            setMessage({ text: 'Bir hata oluştu, lütfen tekrar deneyin. ❌', type: 'danger' })
        }
    }

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
                <h4 className="text-primary">✨ Yeni Etkinlik Oluştur</h4>
            </div>
            <div className="card-body p-4">

                {/* Başarı/Hata Mesajı */}
                {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Başlık ve Kategori */}
                    <div className="row mb-3">
                        <div className="col-md-8">
                            <label className="form-label">Etkinlik Başlığı</label>
                            <input
                                type="text" className="form-control" name="title"
                                value={formData.title} onChange={handleChange} required
                                placeholder="Örn: Huzurevi Ziyareti"
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Kategori</label>
                            <select
                                className="form-select" name="category"
                                value={formData.category} onChange={handleChange}
                            >
                                <option value="SUPPORT">Destek (Yardım)</option>
                                <option value="CELEBRATION">Kutlama (Eğlence)</option>
                            </select>
                        </div>
                    </div>

                    {/* Alt Tip ve Tarih */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Alt Tür</label>
                            <input
                                type="text" className="form-control" name="subType"
                                value={formData.subType} onChange={handleChange} required
                                placeholder="Örn: Moral Gecesi"
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Tarih ve Saat</label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                name="dateTime"
                                value={formData.dateTime}
                                onChange={handleChange}
                                required
                                min={getCurrentDateTime()}  // <-- İŞTE BU EKLENDİ (Geçmişi engeller)
                            />
                        </div>
                    </div>

                    {/* Açıklama */}
                    <div className="mb-3">
                        <label className="form-label">Açıklama</label>
                        <textarea
                            className="form-control" name="description" rows="3"
                            value={formData.description} onChange={handleChange} required
                            placeholder="Etkinlikte neler yapılacak?"
                        ></textarea>
                    </div>

                    {/* Konum Bilgileri */}
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label className="form-label">Şehir</label>
                            <select
                                className="form-select" name="city"
                                value={formData.city} onChange={handleChange} required
                            >
                                <option value="">Şehir Seçiniz</option>
                                {cities.map((city, index) => (
                                    <option key={index} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-8">
                            <label className="form-label">Adres</label>
                            <input
                                type="text" className="form-control" name="address"
                                value={formData.address} onChange={handleChange} required
                                placeholder="Mahalle, sokak, bina no..."
                            />
                        </div>
                    </div>

                    {/* Kontenjan */}
                    <div className="mb-4">
                        <label className="form-label">Gönüllü Kontenjanı</label>
                        <input
                            type="number" className="form-control" name="quota" min="1"
                            value={formData.quota} onChange={handleChange} required
                        />
                    </div>

                    <button type="submit" className="btn btn-success w-100 py-2 fw-bold">
                        Etkinliği Oluştur 🚀
                    </button>
                </form>
            </div>
        </div>
    )
}