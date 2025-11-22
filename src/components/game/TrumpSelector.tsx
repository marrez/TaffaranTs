import { Suit } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getSuitSymbol, getSuitColor } from '@/utils/cardUtils';
import { cn } from '@/lib/utils';

interface TrumpSelectorProps {
  onSelectTrump: (suit: Suit) => void;
}

export const TrumpSelector = ({ onSelectTrump }: TrumpSelectorProps) => {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

  const suitNames: Record<Suit, string> = {
    hearts: 'Cœurs',
    diamonds: 'Carreaux',
    clubs: 'Trèfles',
    spades: 'Piques',
  };

  return (
    <div className="max-w-md mx-auto space-y-6 landscape-phone:space-y-2 p-6 landscape-phone:p-2 animate-fade-in landscape-phone:flex-1 landscape-phone:flex landscape-phone:flex-col landscape-phone:justify-center">
      <div className="text-center space-y-2 landscape-phone:space-y-0.5">
        <h2 className="text-2xl landscape-phone:text-sm font-bold text-foreground">Choisissez l'atout</h2>
        <p className="text-sm landscape-phone:text-[10px] text-muted-foreground landscape-phone:hidden">Sélectionnez la couleur d'atout</p>
      </div>
      
      <div className="grid grid-cols-2 landscape-phone:grid-cols-4 gap-4 landscape-phone:gap-2">
        {suits.map((suit) => (
          <Card
            key={suit}
            className="p-8 landscape-phone:p-3 cursor-pointer hover:scale-105 hover:border-primary hover:shadow-xl transition-all active:scale-95"
            onClick={() => onSelectTrump(suit)}
          >
            <div className="text-center space-y-3 landscape-phone:space-y-1">
              <div className={cn('text-7xl landscape-phone:text-4xl', getSuitColor(suit))}>
                {getSuitSymbol(suit)}
              </div>
              <p className="font-bold text-lg landscape-phone:text-xs capitalize text-foreground">
                {suitNames[suit]}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
