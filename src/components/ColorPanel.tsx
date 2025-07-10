import "./ColorPanel.css";

interface ColorPanelProps {
  color: string;
  onClick: () => void;
  isDisabled?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
}

export function ColorPanel({
  color,
  onClick,
  isDisabled = false,
  isCorrect = false,
  isWrong = false,
}: ColorPanelProps) {
  const classNames = ["color-panel", isCorrect && "correct", isWrong && "wrong"]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classNames}
      style={{ backgroundColor: color }}
      onClick={onClick}
      disabled={isDisabled}
      aria-label="color-panel"
    />
  );
}
