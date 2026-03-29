import { GamificationState, Task } from '../types';
import { XP_REWARDS } from '../constants/gamification';
import { getTaskStatus, getTodayDateString } from './scheduling';

export function calculateXPForCompletion(task: Task): number {
  const status = getTaskStatus(task);
  return status === 'overdue' ? XP_REWARDS.COMPLETE_OVERDUE : XP_REWARDS.COMPLETE_ON_TIME;
}

export function updateStreakOnCompletion(state: GamificationState): GamificationState {
  const today = getTodayDateString();

  if (state.lastActiveDate === today) {
    return {
      ...state,
      completionsToday: state.completionsToday + 1,
    };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  const isConsecutive = state.lastActiveDate === yesterdayStr;
  const newStreak = isConsecutive ? state.currentStreak + 1 : 1;

  return {
    ...state,
    currentStreak: newStreak,
    longestStreak: Math.max(state.longestStreak, newStreak),
    lastActiveDate: today,
    completionsToday: 1,
  };
}

export function checkStreakOnAppOpen(state: GamificationState): GamificationState {
  const today = getTodayDateString();

  if (state.lastActiveDate === today) return state;
  if (!state.lastActiveDate) return state;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  if (state.lastActiveDate !== yesterdayStr) {
    return {
      ...state,
      currentStreak: 0,
      completionsToday: 0,
    };
  }

  return { ...state, completionsToday: 0 };
}
