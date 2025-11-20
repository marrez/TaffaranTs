import { Card, Suit, Rank } from '@/types/game';

const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks: Rank[] = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({
        suit,
        rank,
        id: `${suit}-${rank}`,
      });
    }
  }
  
  return deck;
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const dealCards = (deck: Card[], numPlayers: number): Card[][] => {
  const hands: Card[][] = Array.from({ length: numPlayers }, () => []);
  
  deck.forEach((card, index) => {
    hands[index % numPlayers].push(card);
  });
  
  return hands;
};

export const getSuitSymbol = (suit: Suit): string => {
  const symbols = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠',
  };
  return symbols[suit];
};

export const getSuitColor = (suit: Suit): string => {
  return suit === 'hearts' || suit === 'diamonds' ? 'text-red-600' : 'text-gray-900';
};

export const getRankValue = (rank: Rank): number => {
  const values: Record<Rank, number> = {
    'A': 14, 'K': 13, 'Q': 12, 'J': 11, '10': 10, 
    '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, 
    '4': 4, '3': 3, '2': 2
  };
  return values[rank];
};

export const sortHand = (hand: Card[]): Card[] => {
  const suitOrder: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
  
  return [...hand].sort((a, b) => {
    const suitDiff = suitOrder.indexOf(a.suit) - suitOrder.indexOf(b.suit);
    if (suitDiff !== 0) return suitDiff;
    return getRankValue(b.rank) - getRankValue(a.rank);
  });
};
