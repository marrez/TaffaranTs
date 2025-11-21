export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | 'K' | 'Q' | 'J' | '10' | '9' | '8' | '7';

export interface Card {
  suit: Suit;
  rank: Rank;
  id: string;
}

export interface PlayedCard {
  card: Card;
  playerId: number;
}

export type ContractType = 
  | 'no-tricks'
  | 'no-queens'
  | 'no-last-two'
  | 'no-hearts'
  | 'no-king'
  | 'trumps'
  | 'dominoes'
  | 'salade'
  | 'belotte';

export interface Contract {
  type: ContractType;
  name: string;
  description: string;
  scoring: string;
  icon: string;
}

export interface Player {
  id: number;
  name: string;
  hand: Card[];
  score: number;
  isDealer: boolean;
  isDeclarer: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayer: number;
  declarer: number;
  currentContract: ContractType | null;
  trumpSuit?: Suit;
  dominoesStartRank?: Rank;
  round: number; // 1-28 (7 contracts × 4 players)
  handNumber: number; // 1-8 (8 cards per hand)
  trick: PlayedCard[];
  trickWinner: number | null;
  doubles: number[][];
  scores: number[];
  phase: 'setup' | 'game-setup' | 'contract-selection' | 'trump-selection' | 'doubling' | 'playing' | 'scoring' | 'complete';
  selectedContracts?: ContractType[];
}
