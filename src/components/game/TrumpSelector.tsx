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
    <div className="max-w-md mx-auto space-y-6 p-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Choisissez l'atout</h2>
        <p className="text-sm text-muted-foreground">Sélectionnez la couleur d'atout</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {suits.map((suit) => (
          <Card
            key={suit}
            className="p-8 cursor-pointer hover:scale-105 hover:border-primary hover:shadow-xl transition-all active:scale-95"
            onClick={() => onSelectTrump(suit)}
          >
            <div className="text-center space-y-3">
              <div className={cn('text-7xl', getSuitColor(suit))}>
                {getSuitSymbol(suit)}
              </div>
              <p className="font-bold text-lg capitalize text-foreground">
                {suitNames[suit]}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
