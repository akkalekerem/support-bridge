import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

export default function Home() {
    const { t } = useTranslation();

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
                    <h1 className="display-3 fw-bold mb-4">{t('home.hero_title')}</h1>
                    <p className="lead fs-4 mb-5 px-md-5">
                        {t('home.hero_text')} <br />
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <Link to="/register?role=VOLUNTEER" className="btn btn-success btn-lg px-5 py-3 fw-bold rounded-pill shadow">
                            {t('home.volunteer_btn')}
                        </Link>
                        <Link to="/register?role=REQUESTER" className="btn btn-outline-light btn-lg px-5 py-3 fw-bold rounded-pill">
                            {t('home.requester_btn')}
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. NASIL ÇALIŞIR? (İKONLU BÖLÜM) */}
            <div className="container py-5 my-5">
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-primary">{t('home.how_it_works_title')}</h2>
                    <p className="text-muted">{t('home.how_it_works_sub')}</p>
                </div>
                <div className="row g-4 text-center">
                    <div className="col-md-4">
                        <div className="p-4 rounded shadow-sm h-100 border hover-effect">
                            <div className="display-4 text-primary mb-3">📝</div>
                            <h4>{t('home.step1_title')}</h4>
                            <p className="text-muted">{t('home.step1_text')}</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-4 rounded shadow-sm h-100 border hover-effect">
                            <div className="display-4 text-success mb-3">🔍</div>
                            <h4>{t('home.step2_title')}</h4>
                            <p className="text-muted">{t('home.step2_text')}</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-4 rounded shadow-sm h-100 border hover-effect">
                            <div className="display-4 text-warning mb-3">💬</div>
                            <h4>{t('home.step3_title')}</h4>
                            <p className="text-muted">{t('home.step3_text')}</p>
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
                            <h3 className="fw-bold text-dark">{t('home.vol_title')}</h3>
                            <p className="lead text-muted">
                                {t('home.vol_text')}
                            </p>
                            <ul className="list-unstyled">
                                <li className="mb-2">{t('home.vol_li1')}</li>
                                <li className="mb-2">{t('home.vol_li2')}</li>
                                <li>{t('home.vol_li3')}</li>
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
                            <h3 className="fw-bold text-dark">{t('home.req_title')}</h3>
                            <p className="lead text-muted">
                                {t('home.req_text')}
                            </p>
                            <Link to="/register?role=REQUESTER" className="btn btn-primary mt-3">
                                {t('home.req_btn')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="bg-dark text-white text-center py-4 mt-0">
                <div className="container">
                    <h5 className="fw-bold">Support Bridge 🌉</h5>
                    <p className="small text-white-50">{t('footer.text')}</p>
                    <small>{t('footer.copy')}</small>
                </div>
            </footer>
        </div>
    )
}
