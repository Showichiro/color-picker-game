import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ja from './locales/ja.json';

const resources = {
  en: { translation: en },
  ja: { translation: ja },
};

const getInitialLanguage = () => {
  const savedLang = localStorage.getItem('language');
  if (savedLang && (savedLang === 'en' || savedLang === 'ja')) {
    return savedLang;
  }
  
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('ja')) {
    return 'ja';
  }
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});