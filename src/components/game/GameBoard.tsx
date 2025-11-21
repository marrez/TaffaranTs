import { Card, Player, PlayedCard } from '@/types/game';
import { PlayingCard } from './PlayingCard';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  trick: PlayedCard[];
  currentContract: string;
  players: Player[];
  currentPlayer: number;
  tricksWon: number[];
  trickWinner: number | null;
}

export const GameBoard = ({ 
  trick, 
  currentContract, 
  players, 
  currentPlayer,
  tricksWon,
  trickWinner 
}: GameBoardProps) => {
  // Position cards based on which player played them
  const getCardPosition = (playerId: number) => {
    const positions = [
      'bottom-4 left-1/2 -translate-x-1/2', // Player 0 (bottom)
      'left-4 top-1/2 -translate-y-1/2',    // Player 1 (left)
      'top-4 left-1/2 -translate-x-1/2',    // Player 2 (top)
      'right-4 top-1/2 -translate-y-1/2',   // Player 3 (right)
    ];
    return positions[playerId];
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto px-2">
      {/* Felt table background - responsive circular/horizontal table */}
      <div className="relative rounded-full w-full aspect-square max-w-[280px] sm:max-w-md md:max-w-2xl mx-auto p-4 sm:p-8 md:p-12
                      sm:rounded-3xl sm:aspect-auto sm:min-h-[300px]"
        style={{
          background: 'var(--felt-texture)',
          boxShadow: 'inset 0 4px 20px rgba(0, 0, 0, 0.4), 0 4px 20px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Contract display - center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
          <div className="px-2 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 bg-primary/10 backdrop-blur-md text-primary-foreground rounded-full text-xs sm:text-sm md:text-lg font-bold shadow-lg mb-1 sm:mb-2">
            {currentContract}
          </div>
          {trick.length === 0 && (
            <div className="text-muted-foreground/50 text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2">
              En attente...
            </div>
          )}
        </div>

        {/* Cards in play - positioned based on player who played them */}
        {trick.map((playedCard, index) => (
          <div
            key={playedCard.card.id}
            className={cn(
              'absolute z-20 transition-all duration-500 ease-out',
              getCardPosition(playedCard.playerId)
            )}
            style={{ 
              animation: 'cardSlide 0.4s ease-out',
              animationDelay: `${index * 150}ms`,
              animationFillMode: 'both'
            }}
          >
            <PlayingCard
              card={playedCard.card}
              isPlayable={false}
              size="sm"
              className="sm:hidden"
            />
            <PlayingCard
              card={playedCard.card}
              isPlayable={false}
              size="md"
              className="hidden sm:block"
            />
          </div>
        ))}

        {/* Player indicators around the table */}
        {players.map((player, index) => {
          const positionClasses = [
            'bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-1 sm:mt-2',
            'left-0 top-1/2 -translate-y-1/2 -translate-x-full mr-1 sm:mr-2 md:mr-4',
            'top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-1 sm:mb-2',
            'right-0 top-1/2 -translate-y-1/2 translate-x-full ml-1 sm:ml-2 md:ml-4',
          ];

          return (
            <div
              key={player.id}
              className={cn(
                'absolute px-1 sm:px-2 md:px-4 py-0.5 sm:py-1 md:py-2 rounded-md sm:rounded-lg transition-all duration-300 text-[10px] sm:text-xs md:text-sm',
                positionClasses[index],
                currentPlayer === index && 'bg-primary/20 ring-1 sm:ring-2 ring-primary',
                trickWinner === index && 'bg-accent/30 ring-1 sm:ring-2 ring-accent animate-pulse-slow'
              )}
            >
              <div className="text-center whitespace-nowrap">
                <p className={cn(
                  'font-bold',
                  currentPlayer === index && 'text-primary',
                  trickWinner === index && 'text-accent'
                )}>
                  {player.name}
                </p>
                <p className="text-[8px] sm:text-[10px] md:text-xs text-muted-foreground">
                  {tricksWon[index]} pli{tricksWon[index] > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
