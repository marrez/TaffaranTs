import { Card } from '@/types/game';
import { PlayingCard } from './PlayingCard';
import { sortHand } from '@/utils/cardUtils';
import { cn } from '@/lib/utils';

interface PlayerHandProps {
  cards: Card[];
  onCardClick?: (card: Card) => void;
  playableCards?: Set<string>;
  selectedCard?: Card | null;
  playerName: string;
  isCurrentPlayer: boolean;
}

export const PlayerHand = ({
  cards,
  onCardClick,
  playableCards,
  selectedCard,
  playerName,
  isCurrentPlayer,
}: PlayerHandProps) => {
  const sortedCards = sortHand(cards);

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-center justify-between px-4">
        <h3 className={cn(
          'text-lg font-bold',
          isCurrentPlayer && 'text-primary animate-pulse-gold'
        )}>
          {playerName}
          {isCurrentPlayer && ' - Your Turn'}
        </h3>
        <span className="text-sm text-muted-foreground">
          {cards.length} cards
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-2 px-2">
        {sortedCards.map((card, index) => (
          <div
            key={card.id}
            className="animate-card-deal"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <PlayingCard
              card={card}
              onClick={() => onCardClick?.(card)}
              isPlayable={playableCards?.has(card.id) ?? true}
              isSelected={selectedCard?.id === card.id}
              size="md"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
