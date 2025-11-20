import { Card } from '@/types/game';
import { getSuitSymbol, getSuitColor } from '@/utils/cardUtils';
import { cn } from '@/lib/utils';

interface PlayingCardProps {
  card: Card;
  onClick?: () => void;
  isPlayable?: boolean;
  isSelected?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PlayingCard = ({
  card,
  onClick,
  isPlayable = true,
  isSelected = false,
  className,
  size = 'md',
}: PlayingCardProps) => {
  const suitSymbol = getSuitSymbol(card.suit);
  const colorClass = getSuitColor(card.suit);

  const sizeClasses = {
    sm: 'w-12 h-16 text-xs',
    md: 'w-16 h-24 text-sm',
    lg: 'w-20 h-32 text-base',
  };

  return (
    <button
      onClick={onClick}
      disabled={!isPlayable}
      className={cn(
        'relative rounded-lg bg-card-white shadow-lg transition-all duration-300',
        'border-2 flex flex-col items-center justify-between p-2',
        'active:scale-95',
        sizeClasses[size],
        isPlayable && 'cursor-pointer hover:scale-105 hover:-translate-y-2',
        !isPlayable && 'opacity-50 cursor-not-allowed',
        isSelected && 'ring-4 ring-primary -translate-y-2 shadow-2xl',
        className
      )}
      style={{
        boxShadow: isSelected 
          ? '0 0 20px rgba(251, 146, 60, 0.5), 0 10px 30px -5px rgba(0, 0, 0, 0.5)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Top left rank and suit */}
      <div className={cn('font-bold leading-none', colorClass)}>
        <div className="text-center">{card.rank}</div>
        <div className="text-center text-lg">{suitSymbol}</div>
      </div>

      {/* Center suit symbol */}
      <div className={cn('text-4xl', colorClass)}>
        {suitSymbol}
      </div>

      {/* Bottom right rank and suit (upside down) */}
      <div className={cn('font-bold leading-none rotate-180', colorClass)}>
        <div className="text-center">{card.rank}</div>
        <div className="text-center text-lg">{suitSymbol}</div>
      </div>
    </button>
  );
};
