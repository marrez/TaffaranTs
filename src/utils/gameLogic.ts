import { Card, ContractType, Suit, Rank } from '@/types/game';

/**
 * Calculate score for a completed hand based on contract type
 */
export const calculateContractScore = (
  contractType: ContractType,
  playerCards: Card[],
  tricksWon: number,
  isLastTrick: boolean,
  isSecondToLastTrick: boolean,
  trumpSuit?: Suit
): number => {
  switch (contractType) {
    case 'no-tricks':
      // -2 points per trick won
      return tricksWon * -2;

    case 'no-queens':
      // -20 points per queen captured
      const queensCaptured = playerCards.filter(c => c.rank === 'Q').length;
      return queensCaptured * -20;

    case 'no-last-two':
      // -10 for second-to-last trick, -20 for last trick
      let score = 0;
      if (isSecondToLastTrick) score -= 10;
      if (isLastTrick) score -= 20;
      return score;

    case 'no-hearts':
      // -10 per heart captured
      const hearts = playerCards.filter(c => c.suit === 'hearts').length;
      return hearts * -10;

    case 'no-king':
      // -80 for King of Hearts
      const hasKingOfHearts = playerCards.some(
        c => c.suit === 'hearts' && c.rank === 'K'
      );
      return hasKingOfHearts ? -80 : 0;

    case 'trumps':
      // +5 points per trick won (max +40 for 8 tricks)
      return tricksWon * 5;

    case 'dominoes':
      // Points based on finish position (1st: +45, 2nd: +20, 3rd: +5, 4th: -5)
      // This will be handled separately as it requires tracking all players
      return 0;

    case 'salade':
      // Combine all penalties
      let saladeScore = 0;
      saladeScore += tricksWon * -2; // No tricks
      saladeScore += playerCards.filter(c => c.rank === 'Q').length * -20; // Queens
      saladeScore += playerCards.filter(c => c.suit === 'hearts').length * -10; // Hearts
      if (playerCards.some(c => c.suit === 'hearts' && c.rank === 'K')) {
        saladeScore -= 80; // King of hearts
      }
      if (isSecondToLastTrick) saladeScore -= 10;
      if (isLastTrick) saladeScore -= 20;
      return saladeScore;

    case 'belotte':
      // Belotte scoring with trump
      return calculateBelotteScore(playerCards, trumpSuit);

    default:
      return 0;
  }
};

/**
 * Determine trick winner based on lead suit and cards played
 */
export const determineTrickWinner = (
  trick: Card[],
  leadSuit: Suit,
  trumpSuit?: Suit
): number => {
  if (trick.length === 0) return -1;

  let winningIndex = 0;
  let winningCard = trick[0];

  for (let i = 1; i < trick.length; i++) {
    const currentCard = trick[i];

    // Trump beats everything
    if (trumpSuit) {
      if (currentCard.suit === trumpSuit && winningCard.suit !== trumpSuit) {
        winningIndex = i;
        winningCard = currentCard;
        continue;
      }
      if (winningCard.suit === trumpSuit && currentCard.suit !== trumpSuit) {
        continue;
      }
    }

    // Same suit: higher rank wins
    if (currentCard.suit === winningCard.suit) {
      if (getRankValue(currentCard.rank) > getRankValue(winningCard.rank)) {
        winningIndex = i;
        winningCard = currentCard;
      }
    } else if (currentCard.suit === leadSuit && winningCard.suit !== leadSuit) {
      // Lead suit beats off-suit (when no trump involved)
      winningIndex = i;
      winningCard = currentCard;
    }
  }

  return winningIndex;
};

/**
 * Check if a card can legally be played
 */
export const isCardPlayable = (
  card: Card,
  hand: Card[],
  trick: Card[],
  contractType: ContractType | null
): boolean => {
  // First card of trick is always playable
  if (trick.length === 0) return true;

  const leadSuit = trick[0].suit;
  const hasSuit = hand.some(c => c.suit === leadSuit);

  // Must follow suit if possible
  if (hasSuit && card.suit !== leadSuit) {
    return false;
  }

  return true;
};

/**
 * Calculate dominoes position scores
 */
export const calculateDominoesScores = (finishOrder: number[]): number[] => {
  const scores = [0, 0, 0, 0];
  const points = [45, 20, 5, -5];

  finishOrder.forEach((playerId, position) => {
    scores[playerId] = points[position];
  });

  return scores;
};

/**
 * Calculate Belotte score for captured cards
 */
export const calculateBelotteScore = (cards: Card[], trumpSuit?: Suit): number => {
  let score = 0;
  
  cards.forEach(card => {
    if (card.suit === trumpSuit) {
      // Trump values
      if (card.rank === 'J') score += 20;
      else if (card.rank === '9') score += 14;
      else if (card.rank === 'A') score += 11;
      else if (card.rank === '10') score += 10;
      else if (card.rank === 'K') score += 4;
      else if (card.rank === 'Q') score += 3;
      else if (card.rank === '8') score += 0;
      else if (card.rank === '7') score += 0;
    } else {
      // Normal values
      if (card.rank === 'A') score += 11;
      else if (card.rank === '10') score += 10;
      else if (card.rank === 'K') score += 4;
      else if (card.rank === 'Q') score += 3;
      else if (card.rank === 'J') score += 2;
    }
  });
  
  return score;
};

/**
 * Get numeric value for rank (for comparison)
 */
const getRankValue = (rank: Rank): number => {
  const values: Record<Rank, number> = {
    'A': 14,
    'K': 13,
    'Q': 12,
    'J': 11,
    '10': 10,
    '9': 9,
    '8': 8,
    '7': 7,
  };
  return values[rank];
};
