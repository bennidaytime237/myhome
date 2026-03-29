import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../src/components/ui/Card';
import { XPBar } from '../../src/components/XPBar';
import { StreakCounter } from '../../src/components/StreakCounter';
import { useTasks } from '../../src/context/TaskContext';
import { useGamification } from '../../src/context/GamificationContext';
import { getLevelTitle } from '../../src/constants/gamification';
import { colors, fonts, fontSize, spacing, borderRadius } from '../../src/constants/theme';

export default function ProfileScreen() {
  const { tasks } = useTasks();
  const { state: gam } = useGamification();

  const totalCompletions = tasks.reduce((sum, t) => sum + t.completionHistory.length, 0);
  const onTimeCompletions = tasks.reduce(
    (sum, t) => sum + t.completionHistory.filter((c) => c.wasOnTime).length,
    0
  );
  const onTimeRate = totalCompletions > 0 ? Math.round((onTimeCompletions / totalCompletions) * 100) : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Progress</Text>

        {/* Level card */}
        <Card style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View style={styles.levelBadgeLarge}>
              <Text style={styles.levelNumber}>{gam.level}</Text>
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelTitle}>{getLevelTitle(gam.level)}</Text>
              <Text style={styles.totalXP}>{gam.totalXP} total XP</Text>
            </View>
          </View>
          <XPBar totalXP={gam.totalXP} level={gam.level} />
        </Card>

        {/* Streak */}
        <Card style={styles.card}>
          <StreakCounter streak={gam.currentStreak} longestStreak={gam.longestStreak} />
        </Card>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.primary + '15' }]}>
            <Text style={styles.statNumber}>{totalCompletions}</Text>
            <Text style={styles.statLabel}>Tasks Completed</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.secondary + '15' }]}>
            <Text style={styles.statNumber}>{onTimeRate}%</Text>
            <Text style={styles.statLabel}>On Time Rate</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.accent + '15' }]}>
            <Text style={styles.statNumber}>{gam.completionsToday}</Text>
            <Text style={styles.statLabel}>Done Today</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.warning + '15' }]}>
            <Text style={styles.statNumber}>{tasks.length}</Text>
            <Text style={styles.statLabel}>Active Tasks</Text>
          </View>
        </View>

        {/* Motivational message */}
        <Card style={styles.motivationCard}>
          <Text style={styles.motivationEmoji}>
            {gam.currentStreak >= 7
              ? '🌟'
              : gam.currentStreak >= 3
                ? '💪'
                : gam.completionsToday > 0
                  ? '👏'
                  : '🌱'}
          </Text>
          <Text style={styles.motivationText}>
            {gam.currentStreak >= 7
              ? "Incredible streak! You're a home care superstar!"
              : gam.currentStreak >= 3
                ? 'Great consistency! Keep that streak going!'
                : gam.completionsToday > 0
                  ? "Nice work today! Every task counts."
                  : 'Complete a task to start building your streak!'}
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xxl,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  levelCard: {
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  levelBadgeLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelNumber: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xl,
    color: colors.white,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xl,
    color: colors.textPrimary,
  },
  totalXP: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  card: {
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    width: '48%',
    flexGrow: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xxl,
    color: colors.textPrimary,
  },
  statLabel: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  motivationCard: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  motivationEmoji: {
    fontSize: 40,
  },
  motivationText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
