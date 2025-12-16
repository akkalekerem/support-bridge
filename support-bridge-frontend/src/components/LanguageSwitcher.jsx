import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="btn-group">
            <button
                onClick={() => changeLanguage('tr')}
                className={`btn btn-sm ${i18n.language === 'tr' ? 'btn-primary' : 'btn-outline-primary'}`}
            >
                TR
            </button>
            <button
                onClick={() => changeLanguage('en')}
                className={`btn btn-sm ${i18n.language === 'en' ? 'btn-primary' : 'btn-outline-primary'}`}
            >
                EN
            </button>
        </div>
    );
}
