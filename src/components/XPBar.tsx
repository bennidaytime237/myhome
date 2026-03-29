import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, fontSize, spacing, borderRadius } from '../constants/theme';
import { getXPForCurrentLevel, getXPToNextLevel, getLevelTitle } from '../constants/gamification';

interface XPBarProps {
  totalXP: number;
  level: number;
}

export function XPBar({ totalXP, level }: XPBarProps) {
  const currentLevelXP = getXPForCurrentLevel(totalXP);
  const xpNeeded = getXPToNextLevel();
  const progress = currentLevelXP / xpNeeded;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelNumber}>{level}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>{getLevelTitle(level)}</Text>
          <Text style={styles.xpText}>
            {currentLevelXP} / {xpNeeded} XP
          </Text>
        </View>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${Math.min(100, progress * 100)}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  levelBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelNumber: {
    fontFamily: fonts.bold,
    fontSize: fontSize.lg,
    color: colors.white,
  },
  info: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  xpText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  barBackground: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
});
