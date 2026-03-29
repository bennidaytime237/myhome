import React from 'react';
import { TaskProvider } from './TaskContext';
import { GamificationProvider } from './GamificationContext';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <GamificationProvider>
      <TaskProvider>{children}</TaskProvider>
    </GamificationProvider>
  );
}
