type GameHeaderProps = {
  score: number;
  level: number;
  lives: number;
  streak: number;
};

export const GameHeader = ({ score, level, lives, streak }: GameHeaderProps) => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Color Picker Game
      </h1>
      <div className="flex justify-center gap-8 text-lg">
        <div>
          <span className="font-semibold">Score:</span> {score}
        </div>
        <div>
          <span className="font-semibold">Level:</span> {level}
        </div>
        <div>
          <span className="font-semibold">Lives:</span> {lives}
        </div>
        <div>
          <span className="font-semibold">Streak:</span> {streak}
        </div>
      </div>
    </header>
  );
};