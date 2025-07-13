type GameHeaderProps = {
  score: number;
  level: number;
  lives: number;
  streak: number;
};

export const GameHeader = ({ score, level, lives, streak }: GameHeaderProps) => {
  return (
    <header className="text-center mb-4 sm:mb-6 md:mb-8 px-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">
        Color Picker Game
      </h1>
      <div className="grid grid-cols-2 sm:flex sm:justify-center gap-3 sm:gap-6 md:gap-8 text-sm sm:text-base md:text-lg">
        <div className="bg-gray-100 rounded-lg px-3 py-1 sm:px-4 sm:py-2">
          <span className="font-semibold">Score:</span> {score}
        </div>
        <div className="bg-gray-100 rounded-lg px-3 py-1 sm:px-4 sm:py-2">
          <span className="font-semibold">Level:</span> {level}
        </div>
        <div className="bg-gray-100 rounded-lg px-3 py-1 sm:px-4 sm:py-2">
          <span className="font-semibold">Lives:</span> {lives}
        </div>
        <div className="bg-gray-100 rounded-lg px-3 py-1 sm:px-4 sm:py-2">
          <span className="font-semibold">Streak:</span> {streak}
        </div>
      </div>
    </header>
  );
};