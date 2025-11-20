import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GameBoard } from '@/components/game/GameBoard';
import { PlayerHand } from '@/components/game/PlayerHand';
import { ScoreBoard } from '@/components/game/ScoreBoard';
import { ContractSelector } from '@/components/game/ContractSelector';
import { TutorialOverlay } from '@/components/game/TutorialOverlay';
import { GameState, ContractType, Card } from '@/types/game';
import { createDeck, shuffleDeck, dealCards } from '@/utils/cardUtils';
import { contracts } from '@/data/contracts';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { HelpCircle, Trophy } from 'lucide-react';

const Index = () => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [gameState, setGameState] = useState<GameState>({
    players: [
      { id: 0, name: 'You', hand: [], score: 0, isDealer: false, isDeclarer: true },
      { id: 1, name: 'Player 2', hand: [], score: 0, isDealer: false, isDeclarer: false },
      { id: 2, name: 'Player 3', hand: [], score: 0, isDealer: true, isDeclarer: false },
      { id: 3, name: 'Player 4', hand: [], score: 0, isDealer: false, isDeclarer: false },
    ],
    currentPlayer: 0,
    declarer: 0,
    currentContract: null,
    round: 1,
    handNumber: 1,
    trick: [],
    trickWinner: null,
    doubles: [],
    scores: [0, 0, 0, 0],
    phase: 'setup',
  });
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [availableContracts, setAvailableContracts] = useState<ContractType[]>(
    contracts.map(c => c.type)
  );

  useEffect(() => {
    // Initial deal
    startNewHand();
  }, []);

  const triggerHaptic = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      // Haptics not available (web)
      console.log('Haptics not available');
    }
  };

  const startNewHand = () => {
    const deck = shuffleDeck(createDeck());
    const hands = dealCards(deck, 4);
    
    setGameState(prev => ({
      ...prev,
      players: prev.players.map((player, index) => ({
        ...player,
        hand: hands[index],
      })),
      trick: [],
      phase: 'contract-selection',
    }));
  };

  const handleContractSelect = (contractType: ContractType) => {
    triggerHaptic();
    setGameState(prev => ({
      ...prev,
      currentContract: contractType,
      phase: 'playing',
    }));

    setAvailableContracts(prev => prev.filter(c => c !== contractType));
  };

  const handleCardClick = (card: Card) => {
    triggerHaptic();
    
    if (gameState.phase !== 'playing') return;
    
    setSelectedCard(card);
    
    // Play the card
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        trick: [...prev.trick, card],
        players: prev.players.map(p =>
          p.id === prev.currentPlayer
            ? { ...p, hand: p.hand.filter(c => c.id !== card.id) }
            : p
        ),
        currentPlayer: (prev.currentPlayer + 1) % 4,
      }));
      
      setSelectedCard(null);
    }, 300);
  };

  const currentContract = gameState.currentContract
    ? contracts.find(c => c.type === gameState.currentContract)?.name
    : 'Selecting...';

  return (
    <div 
      className="min-h-screen bg-felt-green relative overflow-hidden"
      style={{ background: 'var(--felt-texture)' }}
    >
      {showTutorial && <TutorialOverlay onClose={() => setShowTutorial(false)} />}

      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🃏</div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Taffaran</h1>
              <p className="text-xs text-muted-foreground">French Card Game</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowTutorial(true)}
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Trophy className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Score Board */}
        <ScoreBoard
          players={gameState.players}
          currentRound={gameState.round}
          totalRounds={28}
        />

        {/* Contract Selection or Game Board */}
        {gameState.phase === 'contract-selection' ? (
          <ContractSelector
            availableContracts={availableContracts}
            onSelectContract={handleContractSelect}
          />
        ) : (
          <GameBoard
            trick={gameState.trick}
            currentContract={currentContract || 'No Contract'}
          />
        )}

        {/* Player's Hand */}
        {gameState.phase === 'playing' && (
          <PlayerHand
            cards={gameState.players[0].hand}
            onCardClick={handleCardClick}
            selectedCard={selectedCard}
            playerName={gameState.players[0].name}
            isCurrentPlayer={gameState.currentPlayer === 0}
          />
        )}

        {/* Debug/Testing Controls */}
        {gameState.phase === 'playing' && gameState.players[0].hand.length === 0 && (
          <div className="text-center py-8 space-y-4 animate-fade-in">
            <h2 className="text-2xl font-bold text-foreground">Hand Complete!</h2>
            <Button
              onClick={startNewHand}
              className="bg-primary hover:bg-primary/90"
            >
              Next Hand
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
