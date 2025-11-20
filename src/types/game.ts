export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | 'K' | 'Q' | 'J' | '10' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';

export interface Card {
  suit: Suit;
  rank: Rank;
  id: string;
}

export type ContractType = 
  | 'no-tricks'
  | 'no-queens'
  | 'no-last-two'
  | 'no-hearts'
  | 'no-king'
  | 'trumps'
  | 'dominoes';

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
  round: number; // 1-28
  handNumber: number; // 1-7 for each player
  trick: Card[];
  trickWinner: number | null;
  doubles: number[][];
  scores: number[];
  phase: 'setup' | 'contract-selection' | 'doubling' | 'playing' | 'scoring' | 'complete';
}
