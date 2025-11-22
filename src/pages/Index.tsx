import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { GameBoard } from '@/components/game/GameBoard';
import { PlayerHand } from '@/components/game/PlayerHand';
import { PlayingCard } from '@/components/game/PlayingCard';
import { ScoreBoard } from '@/components/game/ScoreBoard';
import { ContractSelector } from '@/components/game/ContractSelector';
import { GameSetup } from '@/components/game/GameSetup';
import { TrumpSelector } from '@/components/game/TrumpSelector';
import { TutorialOverlay } from '@/components/game/TutorialOverlay';
import { GameState, ContractType, Card, Suit } from '@/types/game';
import { createDeck, shuffleDeck, dealCards } from '@/utils/cardUtils';
import { contracts } from '@/data/contracts';
import { determineTrickWinner, calculateContractScore, isCardPlayable } from '@/utils/gameLogic';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { HelpCircle, BarChart3, X } from 'lucide-react';

const Index = () => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [showScoreboard, setShowScoreboard] = useState(false);
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
    phase: 'game-setup',
    selectedContracts: [],
  });
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [availableContracts, setAvailableContracts] = useState<ContractType[]>([]);
  const [tricksWon, setTricksWon] = useState<number[]>([0, 0, 0, 0]);
  const capturedCardsRef = useRef<Card[][]>([[], [], [], []]);
  const [trickLeader, setTrickLeader] = useState<number>(0);

  const handleGameSetup = (selectedContracts: ContractType[]) => {
    setGameState(prev => ({
      ...prev,
      selectedContracts,
      phase: 'setup',
    }));
    setAvailableContracts(selectedContracts);
    startNewHand();
  };

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
      trickWinner: null,
      phase: 'contract-selection',
      currentPlayer: prev.declarer,
    }));
    
    setTricksWon([0, 0, 0, 0]);
    capturedCardsRef.current = [[], [], [], []];
  };

  const handleContractSelect = (contractType: ContractType) => {
    triggerHaptic();
    
    // Check if contract needs trump selection
    if (contractType === 'trumps' || contractType === 'belotte') {
      setGameState(prev => ({
        ...prev,
        currentContract: contractType,
        phase: 'trump-selection',
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        currentContract: contractType,
        phase: 'playing',
      }));
    }

    setAvailableContracts(prev => prev.filter(c => c !== contractType));
  };

  const handleTrumpSelect = (suit: Suit) => {
    triggerHaptic();
    setGameState(prev => ({
      ...prev,
      trumpSuit: suit,
      phase: 'playing',
    }));
  };

  const handleCardClick = (card: Card) => {
    triggerHaptic();
    
    if (gameState.phase !== 'playing') return;
    if (gameState.currentPlayer !== 0) return; // Not player's turn
    
    // Check if card is playable
    const currentTrickCards = gameState.trick.map(pc => pc.card);
    if (!isCardPlayable(card, gameState.players[0].hand, currentTrickCards, gameState.currentContract)) {
      return;
    }
    
    setSelectedCard(card);
    
    // Play the card
    setTimeout(() => {
      playCard(0, card);
      setSelectedCard(null);
    }, 300);
  };

  const playCard = (playerId: number, card: Card) => {
    setGameState(prev => {
      // Don't allow playing if trick is already complete
      if (prev.trick.length >= 4) {
        return prev;
      }

      const newTrick = [...prev.trick, { card, playerId }];
      const newPlayers = prev.players.map(p =>
        p.id === playerId
          ? { ...p, hand: p.hand.filter(c => c.id !== card.id) }
          : p
      );

      // Track who started the trick
      if (prev.trick.length === 0) {
        setTrickLeader(playerId);
      }

      // Check if trick is complete (4 cards)
      if (newTrick.length === 4) {
        const leadSuit = newTrick[0].card.suit;
        const trickCards = newTrick.map(pc => pc.card);
        const winnerIndex = determineTrickWinner(trickCards, leadSuit, prev.trumpSuit);
        const winnerId = newTrick[winnerIndex].playerId;

        // Show winner animation first
        setTimeout(() => {
          // Update tricks won and captured cards
          setTricksWon(prevTricks => {
            const newTricks = [...prevTricks];
            newTricks[winnerId]++;
            return newTricks;
          });

          // Update captured cards
          capturedCardsRef.current = capturedCardsRef.current.map((cards, i) =>
            i === winnerId ? [...cards, ...trickCards] : cards
          );

          // Clear winner indicator and trick after showing animation
          setTimeout(() => {
            // Check if hand is complete
            if (newPlayers[0].hand.length === 0) {
              setTimeout(() => endHand(), 1000);
            } else {
              // Clear trick and set winner as next player
              setGameState(current => ({
                ...current,
                trick: [],
                trickWinner: null,
                currentPlayer: winnerId,
              }));

              // AI plays if not human player
              if (winnerId !== 0) {
                setTimeout(() => {
                  playAICard(winnerId);
                }, 1000);
              }
            }
          }, 2000); // Show winner for 2 seconds
        }, 500); // Small delay before showing winner

        return {
          ...prev,
          trick: newTrick,
          players: newPlayers,
          trickWinner: winnerId,
        };
      }

      // Trick not complete, next player's turn
      const nextPlayer = (prev.currentPlayer + 1) % 4;
      
      // AI plays if not human player
      if (nextPlayer !== 0) {
        setTimeout(() => playAICard(nextPlayer), 800);
      }

      return {
        ...prev,
        trick: newTrick,
        players: newPlayers,
        currentPlayer: nextPlayer,
      };
    });
  };

  const playAICard = (playerId: number) => {
    setGameState(prev => {
      // IMPORTANT: Verify it's really this player's turn
      if (prev.currentPlayer !== playerId || prev.trick.length >= 4 || prev.phase !== 'playing') {
        return prev; // Abort if conditions not met
      }

      const player = prev.players[playerId];
      if (player.hand.length === 0) return prev;

      // Get current trick cards for validation
      const currentTrickCards = prev.trick.map(pc => pc.card);

      // Simple AI: play first valid card
      let cardToPlay = player.hand.find(card =>
        isCardPlayable(card, player.hand, currentTrickCards, prev.currentContract)
      );

      if (!cardToPlay) {
        cardToPlay = player.hand[0];
      }

      if (!cardToPlay) return prev;

      // Play the card (inline logic)
      const newTrick = [...prev.trick, { card: cardToPlay, playerId }];
      const newPlayers = prev.players.map(p =>
        p.id === playerId
          ? { ...p, hand: p.hand.filter(c => c.id !== cardToPlay.id) }
          : p
      );

      if (prev.trick.length === 0) {
        setTrickLeader(playerId);
      }

      // Trick complete
      if (newTrick.length === 4) {
        const leadSuit = newTrick[0].card.suit;
        const trickCards = newTrick.map(pc => pc.card);
        const winnerIndex = determineTrickWinner(trickCards, leadSuit, prev.trumpSuit);
        const winnerId = newTrick[winnerIndex].playerId;

        setTimeout(() => {
          setTricksWon(prevTricks => {
            const newTricks = [...prevTricks];
            newTricks[winnerId]++;
            return newTricks;
          });

          capturedCardsRef.current = capturedCardsRef.current.map((cards, i) =>
            i === winnerId ? [...cards, ...trickCards] : cards
          );

          if (newPlayers[0].hand.length === 0) {
            setTimeout(() => endHand(), 1500);
          } else {
            setGameState(current => ({
              ...current,
              trick: [],
              trickWinner: winnerId,
              currentPlayer: winnerId,
            }));

            setTimeout(() => {
              if (winnerId !== 0) {
                playAICard(winnerId);
              }
            }, 1500);
          }
        }, 1500);

        return {
          ...prev,
          trick: newTrick,
          players: newPlayers,
          trickWinner: winnerId,
        };
      }

      // Next player
      const nextPlayer = (prev.currentPlayer + 1) % 4;
      
      if (nextPlayer !== 0) {
        setTimeout(() => playAICard(nextPlayer), 800);
      }

      return {
        ...prev,
        trick: newTrick,
        players: newPlayers,
        currentPlayer: nextPlayer,
      };
    });
  };

  const endHand = () => {
    // Calculate scores for each player
    const handScores = gameState.players.map((player, index) => {
      if (!gameState.currentContract) return 0;
      
      return calculateContractScore(
        gameState.currentContract,
        capturedCardsRef.current[index],
        tricksWon[index],
        false, // Track last tricks properly if needed
        false,
        gameState.trumpSuit
      );
    });

    // Update total scores
    setGameState(prev => ({
      ...prev,
      players: prev.players.map((p, i) => ({
        ...p,
        score: p.score + handScores[i],
      })),
      scores: prev.scores.map((s, i) => s + handScores[i]),
      phase: 'scoring',
    }));

    // Show scores briefly, then start next hand
    setTimeout(() => {
      if (availableContracts.length > 0) {
        const nextDeclarer = (gameState.declarer + 1) % 4;
        setGameState(prev => ({
          ...prev,
          declarer: nextDeclarer,
          round: prev.round + 1,
        }));
        startNewHand();
      } else {
        // Game complete
        setGameState(prev => ({ ...prev, phase: 'complete' }));
      }
    }, 3000);
  };

  // Auto-play AI on their turn
  useEffect(() => {
    if (gameState.phase === 'playing' && 
        gameState.currentPlayer !== 0 && 
        gameState.trick.length < 4 &&
        gameState.players[gameState.currentPlayer].hand.length > 0) {
      const timer = setTimeout(() => {
        playAICard(gameState.currentPlayer);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentContract = gameState.currentContract
    ? contracts.find(c => c.type === gameState.currentContract)?.name
    : 'Selecting...';

  return (
    <div 
      className="min-h-screen landscape-phone:h-screen landscape-phone:max-h-screen bg-felt-green relative overflow-hidden landscape-phone:overflow-hidden"
      style={{ background: 'var(--felt-texture)' }}
    >
      {showTutorial && <TutorialOverlay onClose={() => setShowTutorial(false)} />}

      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border shadow-lg landscape-phone:py-0 safe-top">
        <div className="container mx-auto px-4 py-4 landscape-phone:py-1 flex items-center justify-between">
          <div className="flex items-center gap-3 landscape-phone:gap-2">
            <div className="text-3xl landscape-phone:text-2xl">🃏</div>
            <div>
              <h1 className="text-2xl landscape-phone:text-lg font-bold text-foreground">Taffaran</h1>
              <p className="text-xs landscape-phone:text-[10px] text-muted-foreground landscape-phone:hidden">French Card Game</p>
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
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowScoreboard(true)}
            >
              <BarChart3 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Scoreboard Overlay */}
      {showScoreboard && (
        <div 
          className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowScoreboard(false)}
        >
          <div 
            className="max-w-2xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-foreground hover:text-primary"
              onClick={() => setShowScoreboard(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            <ScoreBoard
              players={gameState.players}
              currentRound={gameState.round}
              totalRounds={(gameState.selectedContracts?.length || 7) * 4}
            />
          </div>
        </div>
      )}

      {/* Main Game Area */}
      <main className="container mx-auto px-4 py-6 landscape-phone:py-1 landscape-phone:px-2 space-y-6 landscape-phone:space-y-1 landscape-phone:h-[calc(100vh-50px)] landscape-phone:flex landscape-phone:flex-col landscape-phone:justify-between safe-bottom">
        {/* Game Setup Phase */}
        {gameState.phase === 'game-setup' && (
          <GameSetup onStartGame={handleGameSetup} />
        )}

        {/* Contract Selection Phase */}
        {gameState.phase === 'contract-selection' && (
          <>
            <ContractSelector
              availableContracts={availableContracts}
              onSelectContract={handleContractSelect}
              playedContracts={(gameState.selectedContracts || []).filter(type => !availableContracts.includes(type))}
            />
            {/* Show player's hand during contract selection */}
            <div className="mt-6">
              <PlayerHand
                cards={gameState.players[0].hand}
                onCardClick={() => {}} // No card click during selection
                selectedCard={null}
                playerName="Votre main"
                isCurrentPlayer={false}
              />
            </div>
          </>
        )}

        {/* Trump Selection Phase */}
        {gameState.phase === 'trump-selection' && (
          <TrumpSelector onSelectTrump={handleTrumpSelect} />
        )}

        {/* Game Board */}
        {(gameState.phase === 'playing' || gameState.phase === 'scoring') && (
          <GameBoard
            trick={gameState.trick}
            currentContract={currentContract || 'No Contract'}
            players={gameState.players}
            currentPlayer={gameState.currentPlayer}
            tricksWon={tricksWon}
            trickWinner={gameState.trickWinner}
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
        {gameState.phase === 'scoring' && (
          <div className="text-center py-8 space-y-4 animate-fade-in">
            <h2 className="text-2xl font-bold text-foreground">Hand Complete!</h2>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {gameState.players.map((player, index) => (
                <div key={player.id} className="bg-card p-4 rounded-lg">
                  <p className="font-bold">{player.name}</p>
                  <p className="text-2xl text-primary">{player.score}</p>
                  <p className="text-sm text-muted-foreground">{tricksWon[index]} tricks</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {gameState.phase === 'complete' && (
          <div className="text-center py-8 space-y-4 animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground">Game Complete!</h2>
            <div className="space-y-2">
              {[...gameState.players]
                .sort((a, b) => b.score - a.score)
                .map((player, index) => (
                  <div key={player.id} className="bg-card p-4 rounded-lg max-w-md mx-auto">
                    <span className="text-2xl mr-2">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '4️⃣'}
                    </span>
                    <span className="font-bold">{player.name}</span>
                    <span className="text-2xl text-primary ml-4">{player.score}</span>
                  </div>
                ))}
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary/90 mt-4"
            >
              New Game
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
