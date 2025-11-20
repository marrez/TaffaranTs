import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';

interface TutorialOverlayProps {
  onClose: () => void;
}

export const TutorialOverlay = ({ onClose }: TutorialOverlayProps) => {
  const [step, setStep] = useState(0);

  const tutorialSteps = [
    {
      title: 'Welcome to Barbu! 🎴',
      content: 'Also known as Taffaran, this is a strategic French card game for 4 players. You\'ll play 28 hands total, with 7 different contracts.',
    },
    {
      title: 'The 7 Contracts',
      content: '5 Negative Contracts: No Tricks, No Queens, No Last Two, No Hearts, No King of Hearts (Barbu).\n\n2 Positive Contracts: Trumps and Dominoes.',
    },
    {
      title: 'How to Play',
      content: 'Each player declares 7 times (28 hands total). Choose a contract, decide on doubles, then play cards. The declarer leads first!',
    },
    {
      title: 'Doubling System',
      content: 'After contract selection, players can double each other to create side bets. You must double the declarer at least twice in your 7-hand series.',
    },
    {
      title: 'Scoring',
      content: 'Points vary by contract. Doubles affect final scores. The player with the highest total after 28 hands wins!',
    },
  ];

  const currentStep = tutorialSteps[step];

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <Card className="max-w-lg w-full p-6 space-y-6 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            {currentStep.title}
          </h2>
          <p className="text-muted-foreground whitespace-pre-line">
            {currentStep.content}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-colors ${
                index === step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            Previous
          </Button>
          
          {step < tutorialSteps.length - 1 ? (
            <Button onClick={() => setStep(step + 1)}>
              Next
            </Button>
          ) : (
            <Button onClick={onClose} className="bg-primary">
              Start Playing!
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
