import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GamificationState, DEFAULT_GAMIFICATION } from '../types';
import { getItem, setItem, KEYS } from '../utils/storage';
import { getLevel } from '../constants/gamification';
import { updateStreakOnCompletion, checkStreakOnAppOpen } from '../utils/xp';

interface GamificationContextValue {
  state: GamificationState;
  loaded: boolean;
  awardXP: (amount: number) => void;
  recordCompletion: () => void;
  resetGamification: () => void;
}

const GamificationContext = createContext<GamificationContextValue | null>(null);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GamificationState>(DEFAULT_GAMIFICATION);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await getItem<GamificationState>(KEYS.GAMIFICATION);
      if (saved) {
        const checked = checkStreakOnAppOpen(saved);
        setState(checked);
        if (checked !== saved) {
          await setItem(KEYS.GAMIFICATION, checked);
        }
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    setItem(KEYS.GAMIFICATION, state);
  }, [state, loaded]);

  const awardXP = useCallback((amount: number) => {
    setState((prev) => {
      const newTotalXP = prev.totalXP + amount;
      return {
        ...prev,
        totalXP: newTotalXP,
        level: getLevel(newTotalXP),
      };
    });
  }, []);

  const recordCompletion = useCallback(() => {
    setState((prev) => updateStreakOnCompletion(prev));
  }, []);

  const resetGamification = useCallback(() => {
    setState(DEFAULT_GAMIFICATION);
  }, []);

  return (
    <GamificationContext.Provider
      value={{ state, loaded, awardXP, recordCompletion, resetGamification }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) throw new Error('useGamification must be used within GamificationProvider');
  return context;
}
