import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { useTasks } from '../../src/context/TaskContext';
import { setItem, KEYS } from '../../src/utils/storage';
import { formatFrequency } from '../../src/utils/scheduling';
import { colors, fonts, fontSize, spacing } from '../../src/constants/theme';

export default function CompleteScreen() {
  const router = useRouter();
  const { rooms, tasks } = useTasks();

  const handleStart = async () => {
    await setItem(KEYS.SETTINGS, {
      onboardingComplete: true,
      notificationsEnabled: true,
    });
    router.replace('/(tabs)/dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.step}>Step 3 of 3</Text>
        <Text style={styles.title}>All Set!</Text>
        <Text style={styles.subtitle}>Here's a summary of your home setup</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{rooms.length}</Text>
            <Text style={styles.statLabel}>Rooms</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{tasks.length}</Text>
            <Text style={styles.statLabel}>Tasks</Text>
          </View>
        </View>

        {rooms.map((room) => {
          const roomTasks = tasks.filter((t) => t.roomId === room.id);
          return (
            <Card key={room.id} style={styles.roomCard}>
              <Text style={styles.roomHeader}>
                {room.icon} {room.name}
              </Text>
              {roomTasks.length === 0 ? (
                <Text style={styles.noTasks}>No tasks added</Text>
              ) : (
                roomTasks.map((task) => (
                  <View key={task.id} style={styles.taskRow}>
                    <Text style={styles.taskName}>{task.name}</Text>
                    <Text style={styles.taskFreq}>{formatFrequency(task.frequency)}</Text>
                  </View>
                ))
              )}
            </Card>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Start Tracking"
          onPress={handleStart}
          size="lg"
          style={styles.button}
        />
        <Button
          title="Go Back & Edit"
          onPress={() => router.back()}
          variant="ghost"
          size="md"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  step: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xxl,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.primary + '15',
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: fonts.bold,
    fontSize: fontSize.hero,
    color: colors.primary,
  },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  roomCard: {
    marginBottom: spacing.md,
  },
  roomHeader: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  noTasks: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  taskName: {
    fontFamily: fonts.regular,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    flex: 1,
  },
  taskFreq: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.sm,
    alignItems: 'center',
  },
  button: {
    width: '100%',
  },
});
