import { useLanguage } from '../../i18n/useLanguage';

export const LanguageSelector = () => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => changeLanguage(lang)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            currentLanguage === lang
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          aria-label={`Switch to ${lang === 'en' ? 'English' : '日本語'}`}
        >
          {lang === 'en' ? 'EN' : 'JP'}
        </button>
      ))}
    </div>
  );
};