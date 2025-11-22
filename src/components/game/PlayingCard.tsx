import { Card } from '@/types/game';
import { getSuitSymbol, getSuitColor } from '@/utils/cardUtils';
import { cn } from '@/lib/utils';

interface PlayingCardProps {
  card: Card;
  onClick?: () => void;
  isPlayable?: boolean;
  isSelected?: boolean;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  faceDown?: boolean;
}

export const PlayingCard = ({
  card,
  onClick,
  isPlayable = true,
  isSelected = false,
  className,
  size = 'md',
  faceDown = false,
}: PlayingCardProps) => {
  const suitSymbol = getSuitSymbol(card.suit);
  const colorClass = getSuitColor(card.suit);

  const sizeClasses = {
    xs: 'w-9 h-12 text-[9px]',
    sm: 'w-10 h-14 text-[10px]',
    md: 'w-16 h-24 text-sm',
    lg: 'w-20 h-32 text-base',
  };

  // Face-down card back rendering
  if (faceDown) {
    return (
      <div
        className={cn(
          'relative rounded-lg shadow-lg transition-all duration-300',
          'border-2 border-slate-700 flex items-center justify-center',
          'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800',
          sizeClasses[size],
          className
        )}
        style={{
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="text-2xl opacity-40">🂠</div>
      </div>
    );
  }

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
