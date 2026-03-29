export const XP_REWARDS = {
  COMPLETE_ON_TIME: 20,
  COMPLETE_OVERDUE: 10,
  ROOM_ALL_DONE_BONUS: 15,
  STREAK_DAILY_BONUS: 5,
};

export const XP_PER_LEVEL = 100;

export function getLevel(totalXP: number): number {
  return Math.floor(totalXP / XP_PER_LEVEL) + 1;
}

export function getXPForCurrentLevel(totalXP: number): number {
  return totalXP % XP_PER_LEVEL;
}

export function getXPToNextLevel(): number {
  return XP_PER_LEVEL;
}

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Home Starter',
  2: 'Tidy Apprentice',
  3: 'Clean Keeper',
  4: 'House Helper',
  5: 'Domestic Pro',
  6: 'Home Hero',
  7: 'Maintenance Master',
  8: 'Household Champion',
  9: 'Estate Expert',
  10: 'Home Legend',
};

export function getLevelTitle(level: number): string {
  if (level >= 10) return LEVEL_TITLES[10];
  return LEVEL_TITLES[level] || `Level ${level}`;
}
