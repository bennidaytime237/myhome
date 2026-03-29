import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, fontSize, spacing } from '../constants/theme';

interface StreakCounterProps {
  streak: number;
  longestStreak: number;
}

export function StreakCounter({ streak, longestStreak }: StreakCounterProps) {
  return (
    <View style={styles.container}>
      <View style={styles.current}>
        <Text style={styles.flame}>🔥</Text>
        <Text style={styles.count}>{streak}</Text>
        <Text style={styles.label}>day streak</Text>
      </View>
      <Text style={styles.best}>Best: {longestStreak} days</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  current: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  flame: {
    fontSize: 20,
  },
  count: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xl,
    color: colors.textPrimary,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  best: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
});
