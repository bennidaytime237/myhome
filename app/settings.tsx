import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components/ui/Button';
import { Card } from '../src/components/ui/Card';
import { useTasks } from '../src/context/TaskContext';
import { useGamification } from '../src/context/GamificationContext';
import { clearAll, setItem, KEYS } from '../src/utils/storage';
import { colors, fonts, fontSize, spacing } from '../src/constants/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { rooms, tasks, reset: resetTasks } = useTasks();
  const { state: gam, resetGamification } = useGamification();

  const handleResetAll = () => {
    Alert.alert(
      'Reset Everything',
      'This will delete all rooms, tasks, and progress. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await clearAll();
            resetTasks();
            resetGamification();
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleReRunOnboarding = () => {
    Alert.alert(
      'Re-run Setup',
      'This will take you through the setup again. Your existing data will be kept.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: async () => {
            await setItem(KEYS.SETTINGS, {
              onboardingComplete: false,
              notificationsEnabled: true,
            });
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Button title="← Back" onPress={() => router.back()} variant="ghost" size="sm" />
        <Text style={styles.title}>Settings</Text>

        {/* App info */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>About MyHome</Text>
          <Text style={styles.cardText}>
            A calm, helpful companion for keeping your home in great shape. No accounts, no ads, no data collection — everything stays on your device.
          </Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </Card>

        {/* Stats */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Your Data</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Rooms</Text>
            <Text style={styles.statValue}>{rooms.length}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Tasks</Text>
            <Text style={styles.statValue}>{tasks.length}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total XP</Text>
            <Text style={styles.statValue}>{gam.totalXP}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Level</Text>
            <Text style={styles.statValue}>{gam.level}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Best Streak</Text>
            <Text style={styles.statValue}>{gam.longestStreak} days</Text>
          </View>
        </Card>

        {/* Actions */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Actions</Text>
          <View style={styles.actions}>
            <Button
              title="Re-run Setup Wizard"
              onPress={handleReRunOnboarding}
              variant="outline"
              size="md"
              style={styles.actionBtn}
            />
            <Button
              title="Reset All Data"
              onPress={handleResetAll}
              variant="ghost"
              size="md"
              textStyle={styles.dangerText}
              style={styles.actionBtn}
            />
          </View>
        </Card>

        {/* Privacy */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Privacy</Text>
          <Text style={styles.cardText}>
            MyHome stores all data locally on your device using AsyncStorage. No data is ever sent to any server. No analytics, no tracking, no accounts required. Your home, your data, your privacy.
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
  card: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },
  cardText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  version: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statLabel: {
    fontFamily: fonts.regular,
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  statValue: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  actions: {
    gap: spacing.sm,
  },
  actionBtn: {
    width: '100%',
  },
  dangerText: {
    color: colors.danger,
  },
});
