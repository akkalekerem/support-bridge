import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div className="container-fluid p-0">

            {/* 1. HERO SECTION (DEV KAPAK GÖRSELİ) */}
            <div
                className="d-flex align-items-center justify-content-center text-center text-white"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '80vh' // Ekranın %80'ini kaplasın
                }}
            >
                <div className="container">
                    <h1 className="display-3 fw-bold mb-4">Support Bridge</h1>
                    <p className="lead fs-4 mb-5 px-md-5">
                        İyilik yapmak isteyenlerle, desteğe ihtiyacı olanları buluşturan <br/>
                        en güvenilir dijital köprü.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <Link to="/register?role=VOLUNTEER" className="btn btn-success btn-lg px-5 py-3 fw-bold rounded-pill shadow">
                            🦸‍♂️ Gönüllü Ol
                        </Link>
                        <Link to="/register?role=REQUESTER" className="btn btn-outline-light btn-lg px-5 py-3 fw-bold rounded-pill">
                            🤝 Destek İste
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. NASIL ÇALIŞIR? (İKONLU BÖLÜM) */}
            <div className="container py-5 my-5">
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-primary">Nasıl Çalışır?</h2>
                    <p className="text-muted">Sadece 3 adımda hayatlara dokunun.</p>
                </div>
                <div className="row g-4 text-center">
                    <div className="col-md-4">
                        <div className="p-4 rounded shadow-sm h-100 border hover-effect">
                            <div className="display-4 text-primary mb-3">📝</div>
                            <h4>1. Kayıt Olun</h4>
                            <p className="text-muted">İster gönüllü olarak, ister destek talep eden olarak sisteme katılın.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-4 rounded shadow-sm h-100 border hover-effect">
                            <div className="display-4 text-success mb-3">🔍</div>
                            <h4>2. Etkinlik Bulun</h4>
                            <p className="text-muted">İhtiyaç sahipleri etkinlik açar, gönüllüler başvurur. Sistem sizi eşleştirir.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-4 rounded shadow-sm h-100 border hover-effect">
                            <div className="display-4 text-warning mb-3">💬</div>
                            <h4>3. İletişime Geçin</h4>
                            <p className="text-muted">Onaylanan eşleşmelerden sonra güvenli mesajlaşma ile detayları konuşun.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. DUYGUSAL KARTLAR BÖLÜMÜ */}
            <div className="bg-light py-5">
                <div className="container">
                    <div className="row align-items-center mb-5">
                        <div className="col-md-6">
                            <img
                                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                className="img-fluid rounded-4 shadow-lg"
                                alt="Gönüllüler"
                            />
                        </div>
                        <div className="col-md-6 ps-md-5 mt-4 mt-md-0">
                            <h3 className="fw-bold text-dark">Gönüllüler İçin</h3>
                            <p className="lead text-muted">
                                Boş zamanlarınızda birinin kahramanı olabilirsiniz. Yeteneklerinizi ve zamanınızı
                                toplumsal faydaya dönüştürün.
                            </p>
                            <ul className="list-unstyled">
                                <li className="mb-2">✅ Sosyal sorumluluk projelerine katılın</li>
                                <li className="mb-2">✅ Yeni insanlarla tanışın</li>
                                <li>✅ Sertifikalı etkinlik geçmişi oluşturun</li>
                            </ul>
                        </div>
                    </div>

                    <div className="row align-items-center mt-5 flex-md-row-reverse">
                        <div className="col-md-6">
                            <img
                                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                className="img-fluid rounded-4 shadow-lg"
                                alt="Destek"
                            />
                        </div>
                        <div className="col-md-6 pe-md-5 mt-4 mt-md-0">
                            <h3 className="fw-bold text-dark">Destek İsteyenler İçin</h3>
                            <p className="lead text-muted">
                                Yalnız değilsiniz. Market alışverişinden, kitap okumaya kadar birçok konuda
                                gönüllülerimiz yanınızda.
                            </p>
                            <Link to="/register?role=REQUESTER" className="btn btn-primary mt-3">
                                Hemen Destek İste ➤
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="bg-dark text-white text-center py-4 mt-0">
                <div className="container">
                    <h5 className="fw-bold">Support Bridge 🌉</h5>
                    <p className="small text-white-50">Teknoloji ile İyiliği Buluşturuyoruz.</p>
                    <small>© 2025 Tüm Hakları Saklıdır.</small>
                </div>
            </footer>
        </div>
    )
}