import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../src/components/ui/Card';
import { XPBar } from '../../src/components/XPBar';
import { StreakCounter } from '../../src/components/StreakCounter';
import { TaskCard } from '../../src/components/TaskCard';
import { EmptyState } from '../../src/components/EmptyState';
import { useTasks } from '../../src/context/TaskContext';
import { useGamification } from '../../src/context/GamificationContext';
import { getTaskStatus } from '../../src/utils/scheduling';
import { calculateXPForCompletion } from '../../src/utils/xp';
import { colors, fonts, fontSize, spacing, borderRadius } from '../../src/constants/theme';

type Filter = 'all' | 'due' | 'overdue';

export default function DashboardScreen() {
  const router = useRouter();
  const { rooms, tasks, completeTask } = useTasks();
  const { state: gamification, awardXP, recordCompletion } = useGamification();
  const [filter, setFilter] = useState<Filter>('all');

  const sortedTasks = useMemo(() => {
    const statusOrder = { overdue: 0, due_soon: 1, fresh: 2 };
    return [...tasks].sort(
      (a, b) => statusOrder[getTaskStatus(a)] - statusOrder[getTaskStatus(b)]
    );
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return sortedTasks;
    if (filter === 'due')
      return sortedTasks.filter((t) => {
        const s = getTaskStatus(t);
        return s === 'due_soon' || s === 'overdue';
      });
    return sortedTasks.filter((t) => getTaskStatus(t) === 'overdue');
  }, [sortedTasks, filter]);

  const overdueCount = tasks.filter((t) => getTaskStatus(t) === 'overdue').length;
  const dueSoonCount = tasks.filter((t) => getTaskStatus(t) === 'due_soon').length;

  const handleComplete = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const xp = calculateXPForCompletion(task);
    const wasOnTime = getTaskStatus(task) !== 'overdue';
    completeTask(taskId, xp, wasOnTime);
    awardXP(xp);
    recordCompletion();
  };

  const getRoomForTask = (roomId: string) => rooms.find((r) => r.id === roomId);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>MyHome</Text>
          <TouchableOpacity onPress={() => router.push('/settings')}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.xpSection}>
              <XPBar totalXP={gamification.totalXP} level={gamification.level} />
            </View>
            <View style={styles.streakSection}>
              <StreakCounter
                streak={gamification.currentStreak}
                longestStreak={gamification.longestStreak}
              />
            </View>
          </View>
        </Card>

        {/* Quick summary */}
        {(overdueCount > 0 || dueSoonCount > 0) && (
          <View style={styles.summaryRow}>
            {overdueCount > 0 && (
              <View style={[styles.summaryBadge, styles.overdueBadge]}>
                <Text style={styles.summaryBadgeText}>
                  {overdueCount} overdue
                </Text>
              </View>
            )}
            {dueSoonCount > 0 && (
              <View style={[styles.summaryBadge, styles.dueSoonBadge]}>
                <Text style={styles.summaryBadgeText}>
                  {dueSoonCount} due soon
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Filters */}
        <View style={styles.filters}>
          {(['all', 'due', 'overdue'] as Filter[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'all' ? 'All Tasks' : f === 'due' ? 'Due / Overdue' : 'Overdue Only'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Task list */}
        {filteredTasks.length === 0 ? (
          <EmptyState
            emoji={filter === 'all' ? '🎉' : '✨'}
            title={filter === 'all' ? 'No tasks yet' : 'All caught up!'}
            subtitle={
              filter === 'all'
                ? 'Head to Rooms to add some tasks'
                : 'Nothing due right now — nice work!'
            }
          />
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              room={getRoomForTask(task.roomId)}
              onPress={() => router.push(`/task/${task.id}`)}
              onComplete={() => handleComplete(task.id)}
            />
          ))
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xxl,
    color: colors.textPrimary,
  },
  settingsIcon: {
    fontSize: 24,
  },
  statsCard: {
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  xpSection: {
    flex: 1,
  },
  streakSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  summaryBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
  },
  overdueBadge: {
    backgroundColor: colors.danger + '20',
  },
  dueSoonBadge: {
    backgroundColor: colors.warning + '30',
  },
  summaryBadgeText: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  filterTextActive: {
    color: colors.white,
  },
});
