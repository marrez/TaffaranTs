import { Contract, ContractType } from '@/types/game';
import { contracts } from '@/data/contracts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ContractSelectorProps {
  availableContracts: ContractType[];
  onSelectContract: (contract: ContractType) => void;
  playedContracts?: ContractType[];
}

export const ContractSelector = ({
  availableContracts,
  onSelectContract,
  playedContracts = [],
}: ContractSelectorProps) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-foreground mb-6">
        Choose Your Contract
      </h2>
      
      <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
        {contracts.map((contract) => {
          const isAvailable = availableContracts.includes(contract.type);
          const isPlayed = playedContracts.includes(contract.type);
          
          return (
            <Card
              key={contract.type}
              className={cn(
                'p-4 transition-all duration-300 relative',
                isAvailable && !isPlayed && 'cursor-pointer hover:scale-105 hover:shadow-xl hover:border-primary active:scale-95',
                isPlayed && 'opacity-50 pointer-events-none',
                !isAvailable && !isPlayed && 'opacity-30'
              )}
              onClick={() => isAvailable && !isPlayed && onSelectContract(contract.type)}
            >
              {isPlayed && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="h-4 w-4" />
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className="text-3xl">{contract.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground mb-1">
                    {contract.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {contract.description}
                  </p>
                  <p className="text-xs font-semibold text-primary">
                    {contract.scoring}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
