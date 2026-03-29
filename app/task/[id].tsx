import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { StatusDot } from '../../src/components/ui/StatusDot';
import { Badge } from '../../src/components/ui/Badge';
import { FrequencyPicker } from '../../src/components/FrequencyPicker';
import { TextInput } from '../../src/components/ui/TextInput';
import { EmptyState } from '../../src/components/EmptyState';
import { useTasks } from '../../src/context/TaskContext';
import { useGamification } from '../../src/context/GamificationContext';
import { Frequency } from '../../src/types';
import {
  getTaskStatus,
  formatDueText,
  formatFrequency,
  getNextDueDate,
} from '../../src/utils/scheduling';
import { calculateXPForCompletion } from '../../src/utils/xp';
import { statusColors, colors, fonts, fontSize, spacing, borderRadius } from '../../src/constants/theme';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { rooms, tasks, updateTask, removeTask, completeTask, snoozeTask } = useTasks();
  const { awardXP, recordCompletion } = useGamification();

  const task = tasks.find((t) => t.id === id);
  const room = task ? rooms.find((r) => r.id === task.roomId) : undefined;

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(task?.name || '');
  const [editFrequency, setEditFrequency] = useState<Frequency>(
    task?.frequency || { value: 1, unit: 'weeks' }
  );

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState emoji="❓" title="Task not found" />
        <Button title="Go Back" onPress={() => router.back()} variant="outline" />
      </SafeAreaView>
    );
  }

  const status = getTaskStatus(task);

  const handleComplete = () => {
    const xp = calculateXPForCompletion(task);
    const wasOnTime = status !== 'overdue';
    completeTask(task.id, xp, wasOnTime);
    awardXP(xp);
    recordCompletion();
  };

  const handleSave = () => {
    const trimmed = editName.trim();
    if (!trimmed) return;
    updateTask(task.id, {
      name: trimmed,
      frequency: editFrequency,
      nextDueAt: getNextDueDate(editFrequency, task.lastCompletedAt ? new Date(task.lastCompletedAt) : undefined),
    });
    setEditing(false);
  };

  const handleDelete = () => {
    Alert.alert('Delete Task', `Delete "${task.name}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          removeTask(task.id);
          router.back();
        },
      },
    ]);
  };

  const handleSnooze = (days: number) => {
    snoozeTask(task.id, days);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Button title="← Back" onPress={() => router.back()} variant="ghost" size="sm" />

        {/* Task header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <StatusDot status={status} size={16} />
            <Text style={styles.title}>{task.name}</Text>
          </View>
          {room && (
            <Text style={styles.roomLabel}>
              {room.icon} {room.name}
            </Text>
          )}
          <View style={styles.statusRow}>
            <Badge
              text={status === 'fresh' ? 'On Track' : status === 'due_soon' ? 'Due Soon' : 'Overdue'}
              color={statusColors[status] + '30'}
              textColor={status === 'overdue' ? colors.danger : status === 'due_soon' ? '#B8960F' : '#5A9E6F'}
            />
            <Text style={styles.dueText}>{formatDueText(task)}</Text>
          </View>
        </View>

        {/* Actions */}
        <Card style={styles.actionsCard}>
          <Button title="✓ Mark Complete" onPress={handleComplete} size="lg" style={styles.completeBtn} />
          <View style={styles.snoozeRow}>
            <Text style={styles.snoozeLabel}>Snooze:</Text>
            {[1, 3, 7].map((days) => (
              <Button
                key={days}
                title={`${days}d`}
                onPress={() => handleSnooze(days)}
                variant="outline"
                size="sm"
              />
            ))}
          </View>
        </Card>

        {/* Details */}
        <Card style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Frequency</Text>
            <Text style={styles.detailValue}>{formatFrequency(task.frequency)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Last completed</Text>
            <Text style={styles.detailValue}>
              {task.lastCompletedAt
                ? new Date(task.lastCompletedAt).toLocaleDateString()
                : 'Never'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Times completed</Text>
            <Text style={styles.detailValue}>{task.completionHistory.length}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total XP earned</Text>
            <Text style={styles.detailValue}>
              {task.completionHistory.reduce((sum, c) => sum + c.xpEarned, 0)} XP
            </Text>
          </View>
        </Card>

        {/* Edit */}
        {editing ? (
          <Card style={styles.editCard}>
            <Text style={styles.editTitle}>Edit Task</Text>
            <TextInput label="Name" value={editName} onChangeText={setEditName} />
            <FrequencyPicker value={editFrequency} onChange={setEditFrequency} />
            <View style={styles.editButtons}>
              <Button title="Cancel" onPress={() => setEditing(false)} variant="ghost" size="sm" />
              <Button title="Save" onPress={handleSave} size="sm" disabled={!editName.trim()} />
            </View>
          </Card>
        ) : (
          <View style={styles.editBtnRow}>
            <Button title="Edit Task" onPress={() => setEditing(true)} variant="outline" size="md" />
            <Button title="Delete" onPress={handleDelete} variant="ghost" size="md" textStyle={styles.deleteText} />
          </View>
        )}

        {/* History */}
        {task.completionHistory.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent History</Text>
            {task.completionHistory
              .slice(-10)
              .reverse()
              .map((record, i) => (
                <View key={i} style={styles.historyRow}>
                  <Text style={styles.historyDate}>
                    {new Date(record.completedAt).toLocaleDateString()}
                  </Text>
                  <Badge
                    text={record.wasOnTime ? 'On time' : 'Late'}
                    color={record.wasOnTime ? colors.success + '30' : colors.danger + '30'}
                    textColor={record.wasOnTime ? '#5A9E6F' : colors.danger}
                  />
                  <Text style={styles.historyXP}>+{record.xpEarned} XP</Text>
                </View>
              ))}
          </View>
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
    paddingVertical: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xxl,
    color: colors.textPrimary,
    flex: 1,
  },
  roomLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  dueText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  actionsCard: {
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  completeBtn: {
    width: '100%',
  },
  snoozeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  snoozeLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  detailCard: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  detailValue: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  editCard: {
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  editTitle: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  editBtnRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  deleteText: {
    color: colors.danger,
  },
  section: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyDate: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    flex: 1,
  },
  historyXP: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.sm,
    color: colors.primary,
  },
});
