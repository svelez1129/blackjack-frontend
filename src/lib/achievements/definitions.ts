import type { Achievement } from './types'

// Achievement definitions - the complete list of achievements in the game
export const ACHIEVEMENT_DEFINITIONS: Achievement[] = [
  // FIRST TIME ACHIEVEMENTS (Common)
  {
    id: 'first_hand',
    title: 'Welcome to the Table',
    description: 'Play your first hand of blackjack',
    type: 'first_time',
    rarity: 'common',
    icon: '🎯',
    target: 1,
    current: 0,
    coinReward: 50,
    unlocked: false
  },
  {
    id: 'first_blackjack',
    title: 'Natural!',
    description: 'Get your first blackjack (21 with 2 cards)',
    type: 'first_time',
    rarity: 'common',
    icon: '🎰',
    target: 1,
    current: 0,
    coinReward: 100,
    unlocked: false
  },
  {
    id: 'first_double',
    title: 'Double or Nothing',
    description: 'Use the double down option for the first time',
    type: 'first_time',
    rarity: 'common',
    icon: '⚡',
    target: 1,
    current: 0,
    coinReward: 75,
    unlocked: false
  },
  {
    id: 'first_split',
    title: 'Split Decision',
    description: 'Split a pair for the first time',
    type: 'first_time',
    rarity: 'common',
    icon: '✂️',
    target: 1,
    current: 0,
    coinReward: 75,
    unlocked: false
  },

  // MILESTONE ACHIEVEMENTS
  {
    id: 'hands_10',
    title: 'Getting Started',
    description: 'Play 10 hands',
    type: 'milestone',
    rarity: 'common',
    icon: '🔢',
    target: 10,
    current: 0,
    coinReward: 100,
    unlocked: false
  },
  {
    id: 'hands_50',
    title: 'Regular Player',
    description: 'Play 50 hands',
    type: 'milestone',
    rarity: 'common',
    icon: '🎪',
    target: 50,
    current: 0,
    coinReward: 200,
    unlocked: false
  },
  {
    id: 'hands_100',
    title: 'Experienced',
    description: 'Play 100 hands',
    type: 'milestone',
    rarity: 'rare',
    icon: '💫',
    target: 100,
    current: 0,
    coinReward: 500,
    unlocked: false
  },
  {
    id: 'hands_500',
    title: 'Veteran',
    description: 'Play 500 hands',
    type: 'milestone',
    rarity: 'epic',
    icon: '🏆',
    target: 500,
    current: 0,
    coinReward: 1000,
    unlocked: false
  },

  // WIN STREAK ACHIEVEMENTS
  {
    id: 'win_streak_3',
    title: 'Hot Streak',
    description: 'Win 3 hands in a row',
    type: 'streak',
    rarity: 'common',
    icon: '🔥',
    target: 3,
    current: 0,
    coinReward: 150,
    unlocked: false
  },
  {
    id: 'win_streak_5',
    title: 'On Fire',
    description: 'Win 5 hands in a row',
    type: 'streak',
    rarity: 'rare',
    icon: '🚀',
    target: 5,
    current: 0,
    coinReward: 300,
    unlocked: false
  },
  {
    id: 'win_streak_10',
    title: 'Unstoppable',
    description: 'Win 10 hands in a row',
    type: 'streak',
    rarity: 'epic',
    icon: '⭐',
    target: 10,
    current: 0,
    coinReward: 750,
    unlocked: false
  },

  // BLACKJACK ACHIEVEMENTS
  {
    id: 'blackjacks_5',
    title: 'Lucky Seven',
    description: 'Get 5 blackjacks',
    type: 'milestone',
    rarity: 'rare',
    icon: '🍀',
    target: 5,
    current: 0,
    coinReward: 250,
    unlocked: false
  },
  {
    id: 'blackjacks_10',
    title: 'Natural Born Winner',
    description: 'Get 10 blackjacks',
    type: 'milestone',
    rarity: 'epic',
    icon: '👑',
    target: 10,
    current: 0,
    coinReward: 500,
    unlocked: false
  },

  // MONEY ACHIEVEMENTS
  {
    id: 'win_1000',
    title: 'Big Winner',
    description: 'Win $1,000 in a single hand',
    type: 'milestone',
    rarity: 'rare',
    icon: '💰',
    target: 1,
    current: 0,
    coinReward: 300,
    unlocked: false
  },
  {
    id: 'balance_5000',
    title: 'High Roller',
    description: 'Reach $5,000 in your balance',
    type: 'milestone',
    rarity: 'epic',
    icon: '💎',
    target: 5000,
    current: 0,
    coinReward: 750,
    unlocked: false
  },

  // SKILL ACHIEVEMENTS
  {
    id: 'perfect_21',
    title: 'Perfect Hand',
    description: 'Get 21 with exactly 3 cards',
    type: 'skill',
    rarity: 'rare',
    icon: '🎯',
    target: 1,
    current: 0,
    coinReward: 200,
    unlocked: false
  },
  {
    id: 'split_master',
    title: 'Split Master',
    description: 'Win both hands after splitting 5 times',
    type: 'skill',
    rarity: 'epic',
    icon: '🏅',
    target: 5,
    current: 0,
    coinReward: 500,
    unlocked: false
  },
  {
    id: 'double_winner',
    title: 'Double Down Expert',
    description: 'Win 10 hands after doubling down',
    type: 'skill',
    rarity: 'rare',
    icon: '⚡',
    target: 10,
    current: 0,
    coinReward: 400,
    unlocked: false
  },

  // SPECIAL ACHIEVEMENTS
  {
    id: 'dealer_bust_5',
    title: 'Dealer\'s Nightmare',
    description: 'Win 5 hands by dealer busting',
    type: 'special',
    rarity: 'rare',
    icon: '😈',
    target: 5,
    current: 0,
    coinReward: 250,
    unlocked: false
  },
  {
    id: 'comeback_king',
    title: 'Comeback King',
    description: 'Win a hand after being down to less than $100',
    type: 'special',
    rarity: 'epic',
    icon: '🦸',
    target: 1,
    current: 0,
    coinReward: 500,
    unlocked: false
  },
  {
    id: 'millionaire',
    title: 'Millionaire',
    description: 'Reach $10,000 in your balance',
    type: 'special',
    rarity: 'legendary',
    icon: '🌟',
    target: 10000,
    current: 0,
    coinReward: 2000,
    unlocked: false,
    hidden: true
  }
]

// Achievement categories for organization
export const ACHIEVEMENT_CATEGORIES = {
  'Getting Started': ['first_hand', 'first_blackjack', 'first_double', 'first_split'],
  'Milestones': ['hands_10', 'hands_50', 'hands_100', 'hands_500'],
  'Win Streaks': ['win_streak_3', 'win_streak_5', 'win_streak_10'],
  'Blackjack Master': ['blackjacks_5', 'blackjacks_10', 'perfect_21'],
  'High Roller': ['win_1000', 'balance_5000', 'millionaire'],
  'Skill Based': ['split_master', 'double_winner', 'dealer_bust_5'],
  'Special': ['comeback_king']
}