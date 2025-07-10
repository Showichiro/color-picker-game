import type { ColorPanel as ColorPanelType } from '../../core/game/types';
import type { ColorPanelId } from '../../core/types';

interface ColorPanelProps {
  panel: ColorPanelType;
  onClick: (id: ColorPanelId) => void;
  disabled?: boolean;
  isTarget?: boolean;
}

export const ColorPanel = ({ panel, onClick, disabled = false, isTarget = false }: ColorPanelProps) => {
  const { r, g, b } = panel.color;
  const backgroundColor = `rgb(${r}, ${g}, ${b})`;

  return (
    <button
      type="button"
      onClick={() => onClick(panel.id)}
      disabled={disabled}
      className={`
        relative w-32 h-32 rounded-lg shadow-lg transition-transform
        ${disabled ? 'cursor-not-allowed' : 'hover:scale-105 active:scale-95 cursor-pointer'}
      `}
      style={{ backgroundColor }}
      aria-label="Color panel"
    >
      {isTarget && (
        <span className="absolute top-2 left-2 text-xs bg-white/80 px-2 py-1 rounded">
          Target
        </span>
      )}
    </button>
  );
};