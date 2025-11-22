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
    <div className="space-y-4 landscape-phone:space-y-1 animate-fade-in landscape-phone:overflow-y-auto landscape-phone:flex-1">
      <h2 className="text-2xl landscape-phone:text-sm font-bold text-center text-foreground mb-6 landscape-phone:mb-1">
        Choose Your Contract
      </h2>
      
      <div className="grid grid-cols-1 landscape-phone:grid-cols-2 gap-3 landscape-phone:gap-1 max-w-md landscape-phone:max-w-full mx-auto">
        {contracts.map((contract) => {
          const isAvailable = availableContracts.includes(contract.type);
          const isPlayed = playedContracts.includes(contract.type);
          
          return (
            <Card
              key={contract.type}
              className={cn(
                'p-4 landscape-phone:p-2 transition-all duration-300 relative',
                isAvailable && !isPlayed && 'cursor-pointer hover:scale-105 hover:shadow-xl hover:border-primary active:scale-95',
                isPlayed && 'opacity-50 pointer-events-none',
                !isAvailable && !isPlayed && 'opacity-30'
              )}
              onClick={() => isAvailable && !isPlayed && onSelectContract(contract.type)}
            >
              {isPlayed && (
                <div className="absolute top-2 right-2 landscape-phone:top-1 landscape-phone:right-1 bg-primary text-primary-foreground rounded-full p-1 landscape-phone:p-0.5">
                  <Check className="h-4 w-4 landscape-phone:h-3 landscape-phone:w-3" />
                </div>
              )}
              <div className="flex items-start gap-3 landscape-phone:gap-1">
                <div className="text-3xl landscape-phone:text-xl">{contract.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg landscape-phone:text-xs text-foreground mb-1 landscape-phone:mb-0">
                    {contract.name}
                  </h3>
                  <p className="text-sm landscape-phone:text-[9px] text-muted-foreground mb-2 landscape-phone:mb-0.5 landscape-phone:line-clamp-1">
                    {contract.description}
                  </p>
                  <p className="text-xs landscape-phone:text-[8px] font-semibold text-primary">
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
