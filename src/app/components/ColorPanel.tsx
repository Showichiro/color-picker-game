import { memo, useCallback, useMemo } from 'react';
import type { ColorPanel as ColorPanelType } from '../../core/game/types';
import type { ColorPanelId } from '../../core/types';

interface ColorPanelProps {
  panel: ColorPanelType;
  onClick: (id: ColorPanelId) => void;
  disabled?: boolean;
  isTarget?: boolean;
}

const getButtonClasses = (disabled: boolean) => [
  'relative',
  'w-20 h-20',
  'sm:w-24 sm:h-24',
  'md:w-28 md:h-28',
  'lg:w-32 lg:h-32',
  'rounded-lg',
  'shadow-lg',
  'transition-transform',
  disabled ? 'cursor-not-allowed' : 'hover:scale-105 active:scale-95 cursor-pointer',
].join(' ');

export const ColorPanel = memo(({ panel, onClick, disabled = false, isTarget = false }: ColorPanelProps) => {
  const { r, g, b } = panel.color;
  
  const backgroundColor = useMemo(
    () => `rgb(${r}, ${g}, ${b})`,
    [r, g, b]
  );
  
  const handleClick = useCallback(() => {
    if (!disabled) {
      onClick(panel.id);
    }
  }, [disabled, onClick, panel.id]);
  
  const buttonClasses = useMemo(
    () => getButtonClasses(disabled),
    [disabled]
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={buttonClasses}
      style={{ backgroundColor }}
      aria-label={isTarget ? 'Target color panel' : 'Color choice panel'}
    >
      {isTarget && (
        <span className="absolute top-2 left-2 text-xs bg-white/80 px-2 py-1 rounded">
          Target
        </span>
      )}
    </button>
  );
});