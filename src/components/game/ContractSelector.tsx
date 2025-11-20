import { Contract, ContractType } from '@/types/game';
import { contracts } from '@/data/contracts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ContractSelectorProps {
  availableContracts: ContractType[];
  onSelectContract: (contract: ContractType) => void;
}

export const ContractSelector = ({
  availableContracts,
  onSelectContract,
}: ContractSelectorProps) => {
  const availableContractData = contracts.filter(c => 
    availableContracts.includes(c.type)
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-foreground mb-6">
        Choose Your Contract
      </h2>
      
      <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
        {availableContractData.map((contract) => (
          <Card
            key={contract.type}
            className={cn(
              'p-4 cursor-pointer transition-all duration-300',
              'hover:scale-105 hover:shadow-xl hover:border-primary',
              'active:scale-95'
            )}
            onClick={() => onSelectContract(contract.type)}
          >
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
        ))}
      </div>
    </div>
  );
};
