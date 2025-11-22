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
    <div className="space-y-4 landscape-phone:space-y-0.5 animate-fade-in landscape-phone:overflow-y-auto landscape-phone:flex-1 landscape-phone:py-1">
      <h2 className="text-2xl landscape-phone:text-xs font-bold text-center text-foreground mb-6 landscape-phone:mb-0.5">
        Choose Your Contract
      </h2>

      <div className="grid grid-cols-1 landscape-phone:grid-cols-3 gap-3 landscape-phone:gap-1 max-w-md landscape-phone:max-w-full mx-auto landscape-phone:px-1">
        {contracts.map((contract) => {
          const isAvailable = availableContracts.includes(contract.type);
          const isPlayed = playedContracts.includes(contract.type);
          
          return (
            <Card
              key={contract.type}
              className={cn(
                'p-4 landscape-phone:p-1.5 transition-all duration-300 relative',
                isAvailable && !isPlayed && 'cursor-pointer hover:scale-105 hover:shadow-xl hover:border-primary active:scale-95',
                isPlayed && 'opacity-50 pointer-events-none',
                !isAvailable && !isPlayed && 'opacity-30'
              )}
              onClick={() => isAvailable && !isPlayed && onSelectContract(contract.type)}
            >
              {isPlayed && (
                <div className="absolute top-2 right-2 landscape-phone:top-0.5 landscape-phone:right-0.5 bg-primary text-primary-foreground rounded-full p-1 landscape-phone:p-0.5">
                  <Check className="h-4 w-4 landscape-phone:h-2.5 landscape-phone:w-2.5" />
                </div>
              )}
              <div className="flex items-start gap-3 landscape-phone:gap-1">
                <div className="text-3xl landscape-phone:text-base">{contract.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg landscape-phone:text-[10px] text-foreground mb-1 landscape-phone:mb-0 landscape-phone:leading-tight">
                    {contract.name}
                  </h3>
                  <p className="text-sm landscape-phone:text-[8px] text-muted-foreground mb-2 landscape-phone:mb-0 landscape-phone:line-clamp-1 landscape-phone:leading-tight">
                    {contract.description}
                  </p>
                  <p className="text-xs landscape-phone:text-[7px] font-semibold text-primary landscape-phone:hidden">
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
