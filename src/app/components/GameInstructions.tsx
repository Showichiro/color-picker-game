import { useTranslation } from 'react-i18next';

export const GameInstructions = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="mt-8 text-center text-gray-600">
      <p>{t('game.instructions.clickPanel')}</p>
      <p>{t('game.instructions.levelUpCondition')}</p>
      <p>{t('game.instructions.livesExplanation')}</p>
    </footer>
  );
};