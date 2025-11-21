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
    <div className="max-w-3xl mx-auto space-y-6 p-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Sélection des jeux</h2>
        <p className="text-muted-foreground">
          Choisissez les contrats à jouer dans cette partie
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {contracts.map((contract) => {
          const isSelected = selected.includes(contract.type);
          
          return (
            <Card
              key={contract.type}
              className={cn(
                'p-4 cursor-pointer transition-all duration-300 relative',
                'hover:scale-105 hover:shadow-xl active:scale-95',
                isSelected && 'border-2 border-primary bg-primary/10'
              )}
              onClick={() => toggleContract(contract.type)}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="h-4 w-4" />
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className="text-3xl">{contract.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground">{contract.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{contract.description}</p>
                  <p className="text-xs font-semibold text-primary">{contract.scoring}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => setSelected(contracts.map(c => c.type))}
        >
          Tout sélectionner
        </Button>
        <Button
          onClick={() => onStartGame(selected)}
          disabled={selected.length === 0}
          size="lg"
          className="min-w-[200px]"
        >
          Démarrer la partie ({selected.length} jeu{selected.length > 1 ? 'x' : ''})
        </Button>
      </div>
    </div>
  );
};
