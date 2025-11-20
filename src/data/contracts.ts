import { Contract } from '@/types/game';

export const contracts: Contract[] = [
  {
    type: 'no-tricks',
    name: 'No Tricks',
    description: 'Avoid winning tricks. Each trick costs -2 points.',
    scoring: 'Total: -26 points',
    icon: '🚫',
  },
  {
    type: 'no-queens',
    name: 'No Queens',
    description: 'Avoid capturing queens. Each queen costs -6 points.',
    scoring: 'Total: -24 points',
    icon: '👑',
  },
  {
    type: 'no-last-two',
    name: 'No Last Two',
    description: 'Avoid the last two tricks. 2nd-to-last: -10, Last: -20.',
    scoring: 'Total: -30 points',
    icon: '🎯',
  },
  {
    type: 'no-hearts',
    name: 'No Hearts',
    description: 'Avoid hearts. Each heart: -2, Ace of Hearts: -6.',
    scoring: 'Total: -30 points',
    icon: '❤️',
  },
  {
    type: 'no-king',
    name: 'Barbu (No King)',
    description: 'Avoid the King of Hearts. Costs -20 points.',
    scoring: 'Total: -20 points',
    icon: '♔',
  },
  {
    type: 'trumps',
    name: 'Trumps',
    description: 'Win tricks with your chosen trump suit. +5 per trick.',
    scoring: 'Total: +65 points',
    icon: '🃏',
  },
  {
    type: 'dominoes',
    name: 'Dominoes',
    description: 'Be first to play all cards. 1st: +45, 2nd: +20, 3rd: +5, 4th: -5.',
    scoring: 'Total: +65 points',
    icon: '🎴',
  },
];
