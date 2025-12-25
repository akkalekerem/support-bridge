import { createContext, useState, useEffect, useContext } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const [lang, setLang] = useState(localStorage.getItem('lang') || 'tr');

    useEffect(() => {
        localStorage.setItem('lang', lang);
    }, [lang]);

    const toggleLang = () => {
        setLang((prev) => (prev === 'tr' ? 'en' : 'tr'));
    };

    const translations = {
        tr: {
            navbar: {
                brand: "Destek Köprüsü 🌉",
                home: "Anasayfa",
                login: "Giriş Yap",
                register: "Kayıt Ol",
                dashboard: "Panelim",
                profile: "Profilim",
                logout: "Çıkış",
                welcome: "Merhaba"
            },
            // 🔥 YENİ: DASHBOARD GENEL ALANI
            dashboard: {
                title: "Kontrol Paneli",
                welcomeMsg: "Hoşgeldin",
                roleVolunteer: "Gönüllü",
                roleRequester: "Talep Eden",
                tabEvents: "Tüm Etkinlikler",
                tabApps: "Başvurularım",
                tabRequests: "Taleplerim"
            },
            home: {
                heroTitle: "Destek Köprüsü",
                heroText: "Yardımsever insanlarla, desteğe ihtiyacı olanları buluşturan en güvenilir dijital köprü.",
                btnVolunteer: "Gönüllü Ol",
                btnRequester: "Destek İste",
                howItWorks: "Nasıl Çalışır?",
                step1Title: "1. Kayıt Olun",
                step1Text: "İster gönüllü kahraman, ister destek talep eden olarak sisteme katılın.",
                step2Title: "2. Etkinlik Bulun",
                step2Text: "İhtiyaç sahipleri etkinlik açar, yardımseverler başvurur.",
                step3Title: "3. İletişime Geçin",
                step3Text: "Onaylanan eşleşmelerden sonra güvenli mesajlaşma ile detayları konuşun.",
                cardVolunteerTitle: "Yardımseverler İçin",
                cardVolunteerText: "Boş zamanlarınızda birinin kahramanı olabilirsiniz. Yeteneklerinizi ve zamanınızı toplumsal faydaya dönüştürün.",
                cardRequesterTitle: "Destek İsteyenler İçin",
                cardRequesterText: "Yalnız değilsiniz. Market alışverişinden, kitap okumaya kadar birçok konuda yardımsever insanlar yanınızda.",
                cardRequesterBtn: "Hemen Destek İste ➤",
                footerSlogan: "Teknoloji ile iyiliği buluşturuyoruz."
            },
            login: {
                heroTitle: "İyilik Bulaşıcıdır.",
                heroText: "Bugün birinin hayatına dokunmak için harika bir gün.",
                welcomeTitle: "Tekrar Hoşgeldiniz! 👋",
                welcomeSub: "Hesabınıza giriş yapın",
                emailLabel: "E-POSTA ADRESİ",
                passwordLabel: "ŞİFRE",
                btnSubmit: "Giriş Yap",
                noAccount: "Hesabın yok mu?",
                linkRegister: "Kayıt Ol",
                linkHome: "← Anasayfaya Dön",
                alertError: "Giriş başarısız! Email veya şifre hatalı."
            },
            register: {
                heroVolunteerTitle: "Kahramanımız Olun",
                heroVolunteerText: "Topluluğumuza katılarak dünyayı değiştirmeye bugünden başlayın.",
                heroRequesterTitle: "Yanınızdayız",
                heroRequesterText: "İhtiyaçlarınızı paylaşın, gönüllülerimiz size ulaşsın.",
                formVolunteerTitle: "🦸‍♂️ Gönüllü Kaydı",
                formRequesterTitle: "🤝 Destek Kaydı",
                nameLabel: "AD",
                lastNameLabel: "SOYAD",
                emailLabel: "E-POSTA",
                passwordLabel: "ŞİFRE",
                phoneLabel: "TELEFON",
                expLabel: "TECRÜBELERİNİZ",
                pdfLabel: "DURUM BELGESİ (PDF)",
                btnSubmit: "Kayıt Ol",
                hasAccount: "Zaten üye misin?",
                linkLogin: "Giriş Yap"
            },
            requesterPanel: {
                title: "📂 Taleplerim",
                btnNew: "+ Yeni Talep Oluştur",
                btnCancel: "Vazgeç",
                formTitle: "📝 Yeni Etkinlik",
                placeholderTitle: "Başlık",
                placeholderType: "Alt Tür",
                placeholderDesc: "Açıklama",
                placeholderAddr: "Mahalle, Sokak vb.",
                labelCity: "Şehir",
                labelDate: "Tarih",
                labelQuota: "Kontenjan",
                labelShowPhone: "Gönüllülere telefonumu göster 📞",
                btnSave: "Kaydet",
                badgeApproved: "Yayında ✅",
                badgeRejected: "Reddedildi ❌",
                badgePending: "Onay Bekliyor ⏳",
                quotaUnlimited: "Sınırsız",
                quotaPerson: "Kişi",
                btnApplicants: "Başvurular",
                btnHide: "Gizle",
                noApplicants: "Henüz başvuru yok.",
                btnApprove: "Onayla",
                btnReject: "Reddet",
                btnMessage: "💬 Mesaj"
            },
            volunteerPanel: {
                searchPlaceholder: "🔍 Etkinlik ara...",
                allCities: "Tüm Şehirler",
                noResult: "Aradığınız kriterlere uygun etkinlik bulunamadı.",
                btnDetails: "Detaylar",
                btnApply: "Başvur ✋",
                btnApplied: "Başvuruldu",
                alreadyApplied: "✅ Zaten Başvurdunuz",
                completeApply: "Başvuruyu Tamamla ✋",
                descTitle: "📄 Açıklama:",
                contactTitle: "📞 İletişim Numarası:",
                contactHidden: "🔒 İletişim bilgileri başvuru onaylandıktan sonra mesajlaşma üzerinden paylaşılabilir."
            }
        },
        en: {
            navbar: {
                brand: "Support Bridge 🌉",
                home: "Home",
                login: "Login",
                register: "Register",
                dashboard: "Dashboard",
                profile: "My Profile",
                logout: "Logout",
                welcome: "Hello"
            },
            // 🔥 NEW: DASHBOARD TRANSLATIONS
            dashboard: {
                title: "Control Panel",
                welcomeMsg: "Welcome",
                roleVolunteer: "Volunteer",
                roleRequester: "Requester",
                tabEvents: "All Events",
                tabApps: "My Applications",
                tabRequests: "My Requests"
            },
            home: {
                heroTitle: "Support Bridge",
                heroText: "The most reliable digital bridge connecting benevolent people with those in need of support.",
                btnVolunteer: "Become a Volunteer",
                btnRequester: "Get Support",
                howItWorks: "How It Works?",
                step1Title: "1. Register",
                step1Text: "Join the system either as a volunteer hero or as someone seeking support.",
                step2Title: "2. Find Events",
                step2Text: "Those in need create events, benevolent people apply.",
                step3Title: "3. Contact",
                step3Text: "After approved matches, discuss details via secure messaging.",
                cardVolunteerTitle: "For Volunteers",
                cardVolunteerText: "You can be someone's hero in your spare time. Transform your skills and time into social benefit.",
                cardRequesterTitle: "For Requester",
                cardRequesterText: "You are not alone. Helpful people are with you on many issues from grocery shopping to reading books.",
                cardRequesterBtn: "Request Support Now ➤",
                footerSlogan: "Bringing technology and kindness together."
            },
            login: {
                heroTitle: "Kindness is Contagious.",
                heroText: "Today is a great day to touch someone's life.",
                welcomeTitle: "Welcome Back! 👋",
                welcomeSub: "Login to your account",
                emailLabel: "EMAIL ADDRESS",
                passwordLabel: "PASSWORD",
                btnSubmit: "Login",
                noAccount: "Don't have an account?",
                linkRegister: "Register",
                linkHome: "← Return to Home",
                alertError: "Login failed! Incorrect email or password."
            },
            register: {
                heroVolunteerTitle: "Be Our Hero",
                heroVolunteerText: "Start changing the world today by joining our community.",
                heroRequesterTitle: "We Are With You",
                heroRequesterText: "Share your needs, let our volunteers reach you.",
                formVolunteerTitle: "🦸‍♂️ Volunteer Registration",
                formRequesterTitle: "🤝 Support Registration",
                nameLabel: "NAME",
                lastNameLabel: "SURNAME",
                emailLabel: "EMAIL",
                passwordLabel: "PASSWORD",
                phoneLabel: "PHONE",
                expLabel: "EXPERIENCES",
                pdfLabel: "STATUS DOCUMENT (PDF)",
                btnSubmit: "Register",
                hasAccount: "Already a member?",
                linkLogin: "Login"
            },
            requesterPanel: {
                title: "📂 My Requests",
                btnNew: "+ Create New Request",
                btnCancel: "Cancel",
                formTitle: "📝 New Event",
                placeholderTitle: "Title",
                placeholderType: "Sub Type",
                placeholderDesc: "Description",
                placeholderAddr: "Neighborhood, Street etc.",
                labelCity: "City",
                labelDate: "Date",
                labelQuota: "Quota",
                labelShowPhone: "Show my phone to volunteers 📞",
                btnSave: "Save",
                badgeApproved: "Published ✅",
                badgeRejected: "Rejected ❌",
                badgePending: "Pending ⏳",
                quotaUnlimited: "Unlimited",
                quotaPerson: "Person",
                btnApplicants: "Applicants",
                btnHide: "Hide",
                noApplicants: "No applicants yet.",
                btnApprove: "Approve",
                btnReject: "Reject",
                btnMessage: "💬 Message"
            },
            volunteerPanel: {
                searchPlaceholder: "🔍 Search events...",
                allCities: "All Cities",
                noResult: "No events found matching your criteria.",
                btnDetails: "Details",
                btnApply: "Apply ✋",
                btnApplied: "Applied",
                alreadyApplied: "✅ Already Applied",
                completeApply: "Complete Application ✋",
                descTitle: "📄 Description:",
                contactTitle: "📞 Contact Number:",
                contactHidden: "🔒 Contact info will be shared via messaging after approval."
            }
        }
    };

    const t = (key) => {
        const keys = key.split('.');
        let value = translations[lang];
        keys.forEach(k => {
            value = value ? value[k] : key;
        });
        return value;
    };

    return (
        <SettingsContext.Provider value={{ theme, toggleTheme, lang, toggleLang, t }}>
            {children}
        </SettingsContext.Provider>
    );
};