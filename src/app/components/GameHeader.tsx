import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';

type GameHeaderProps = {
  score: number;
  level: number;
  lives: number;
  streak: number;
};

export const GameHeader = ({ score, level, lives, streak }: GameHeaderProps) => {
  const { t } = useTranslation();
  
  return (
    <header className="text-center mb-4 sm:mb-6 md:mb-8 px-4">
      <div className="flex justify-between items-start mb-2 sm:mb-3 md:mb-4">
        <div className="w-24"></div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 flex-1">
          {t('game.title')}
        </h1>
        <div className="w-24 flex justify-end">
          <LanguageSelector />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:flex sm:justify-center gap-3 sm:gap-6 md:gap-8 text-sm sm:text-base md:text-lg">
        <div className="bg-gray-100 rounded-lg px-3 py-1 sm:px-4 sm:py-2">
          <span className="font-semibold">{t('game.score')}:</span> {score}
        </div>
        <div className="bg-gray-100 rounded-lg px-3 py-1 sm:px-4 sm:py-2">
          <span className="font-semibold">{t('game.level')}:</span> {level}
        </div>
        <div className="bg-gray-100 rounded-lg px-3 py-1 sm:px-4 sm:py-2">
          <span className="font-semibold">{t('game.lives')}:</span> {lives}
        </div>
        <div className="bg-gray-100 rounded-lg px-3 py-1 sm:px-4 sm:py-2">
          <span className="font-semibold">{t('game.streak')}:</span> {streak}
        </div>
      </div>
    </header>
  );
};