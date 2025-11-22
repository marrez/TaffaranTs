import { useState } from 'react';
import { ContractType } from '@/types/game';
import { contracts } from '@/data/contracts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameSetupProps {
  onStartGame: (selectedContracts: ContractType[]) => void;
}

export const GameSetup = ({ onStartGame }: GameSetupProps) => {
  const [selected, setSelected] = useState<ContractType[]>([]);

  const toggleContract = (type: ContractType) => {
    setSelected(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 landscape-phone:space-y-2 p-6 landscape-phone:p-2 animate-fade-in landscape-phone:overflow-y-auto landscape-phone:flex-1">
      <div className="text-center space-y-2 landscape-phone:space-y-0.5">
        <h2 className="text-3xl landscape-phone:text-base font-bold text-foreground">Sélection des jeux</h2>
        <p className="text-muted-foreground landscape-phone:text-[10px] landscape-phone:hidden">
          Choisissez les contrats à jouer dans cette partie
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 landscape-phone:grid-cols-3 gap-3 landscape-phone:gap-1.5">
        {contracts.map((contract) => {
          const isSelected = selected.includes(contract.type);
          
          return (
            <Card
              key={contract.type}
              className={cn(
                'p-4 landscape-phone:p-2 cursor-pointer transition-all duration-300 relative',
                'hover:scale-105 hover:shadow-xl active:scale-95',
                isSelected && 'border-2 border-primary bg-primary/10'
              )}
              onClick={() => toggleContract(contract.type)}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 landscape-phone:top-1 landscape-phone:right-1 bg-primary text-primary-foreground rounded-full p-1 landscape-phone:p-0.5">
                  <Check className="h-4 w-4 landscape-phone:h-3 landscape-phone:w-3" />
                </div>
              )}
              <div className="flex items-start gap-3 landscape-phone:gap-1.5">
                <div className="text-3xl landscape-phone:text-xl">{contract.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg landscape-phone:text-xs text-foreground">{contract.name}</h3>
                  <p className="text-sm landscape-phone:text-[9px] landscape-phone:line-clamp-1 text-muted-foreground mb-2 landscape-phone:mb-0.5">{contract.description}</p>
                  <p className="text-xs landscape-phone:text-[8px] font-semibold text-primary landscape-phone:hidden">{contract.scoring}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center gap-4 landscape-phone:gap-2">
        <Button
          variant="outline"
          onClick={() => setSelected(contracts.map(c => c.type))}
          className="landscape-phone:text-xs landscape-phone:h-8 landscape-phone:px-2"
        >
          Tout sélectionner
        </Button>
        <Button
          onClick={() => onStartGame(selected)}
          disabled={selected.length === 0}
          size="lg"
          className="min-w-[200px] landscape-phone:min-w-[120px] landscape-phone:text-xs landscape-phone:h-8"
        >
          Démarrer la partie ({selected.length} jeu{selected.length > 1 ? 'x' : ''})
        </Button>
      </div>
    </div>
  );
};
