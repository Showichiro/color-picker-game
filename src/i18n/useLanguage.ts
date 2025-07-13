import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const changeLanguage = useCallback(async (language: string) => {
    await i18n.changeLanguage(language);
    setCurrentLanguage(language);
  }, [i18n]);

  return {
    currentLanguage,
    changeLanguage,
    languages: ['en', 'ja'] as const,
  };
};