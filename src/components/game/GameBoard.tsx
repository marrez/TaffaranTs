import { Card } from '@/types/game';
import { PlayingCard } from './PlayingCard';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  trick: Card[];
  currentContract: string;
}

export const GameBoard = ({ trick, currentContract }: GameBoardProps) => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Felt table background */}
      <div className="relative rounded-2xl p-8 min-h-[200px]"
        style={{
          background: 'var(--felt-texture)',
          boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Contract display */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <div className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-bold shadow-lg">
            {currentContract}
          </div>
        </div>

        {/* Cards in play */}
        <div className="flex justify-center items-center gap-4 mt-8">
          {trick.length > 0 ? (
            trick.map((card, index) => (
              <div
                key={card.id}
                className="animate-card-deal"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <PlayingCard
                  card={card}
                  isPlayable={false}
                  size="md"
                />
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground/50 text-sm">
              Waiting for cards...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
