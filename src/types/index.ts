export type TaskStatus = 'fresh' | 'due_soon' | 'overdue';

export type FrequencyUnit = 'days' | 'weeks' | 'months';

export interface Frequency {
  value: number;
  unit: FrequencyUnit;
}

export interface Room {
  id: string;
  name: string;
  icon: string;
  order: number;
  createdAt: string;
}

export interface Task {
  id: string;
  roomId: string;
  name: string;
  description?: string;
  frequency: Frequency;
  lastCompletedAt: string | null;
  nextDueAt: string;
  snoozedUntil: string | null;
  createdAt: string;
  completionHistory: CompletionRecord[];
}

export interface CompletionRecord {
  completedAt: string;
  xpEarned: number;
  wasOnTime: boolean;
}

export interface GamificationState {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  completionsToday: number;
  achievements: string[];
}

export interface AppSettings {
  onboardingComplete: boolean;
  notificationsEnabled: boolean;
}

export const DEFAULT_GAMIFICATION: GamificationState = {
  totalXP: 0,
  level: 1,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  completionsToday: 0,
  achievements: [],
};

export const DEFAULT_SETTINGS: AppSettings = {
  onboardingComplete: false,
  notificationsEnabled: true,
};
