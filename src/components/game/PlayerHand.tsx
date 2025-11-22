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
    <div className="space-y-4 landscape-phone:space-y-1 animate-slide-up landscape-phone:flex-shrink-0">
      <div className="flex items-center justify-between px-4 landscape-phone:px-2 landscape-phone:py-0.5">
        <h3 className={cn(
          'text-lg landscape-phone:text-xs font-bold',
          isCurrentPlayer && 'text-primary animate-pulse-gold'
        )}>
          {playerName}
          {isCurrentPlayer && <span className="landscape-phone:hidden"> - Your Turn</span>}
        </h3>
        <span className="text-sm landscape-phone:text-[10px] text-muted-foreground">
          {cards.length} cards
        </span>
      </div>

      <div className="flex flex-wrap landscape-phone:flex-nowrap landscape-phone:overflow-x-auto landscape-phone:pb-1 justify-center gap-1 sm:gap-2 landscape-phone:gap-0.5 px-1 sm:px-2 landscape-phone:px-1">
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
              size="xs"
              className="landscape-phone:block hidden"
            />
            <PlayingCard
              card={card}
              onClick={() => onCardClick?.(card)}
              isPlayable={playableCards?.has(card.id) ?? true}
              isSelected={selectedCard?.id === card.id}
              size="sm"
              className="sm:hidden landscape-phone:hidden"
            />
            <PlayingCard
              card={card}
              onClick={() => onCardClick?.(card)}
              isPlayable={playableCards?.has(card.id) ?? true}
              isSelected={selectedCard?.id === card.id}
              size="md"
              className="hidden sm:block landscape-phone:hidden"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
