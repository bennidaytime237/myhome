import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/ui/Button';
import { TextInput } from '../../src/components/ui/TextInput';
import { Card } from '../../src/components/ui/Card';
import { TaskCard } from '../../src/components/TaskCard';
import { FrequencyPicker } from '../../src/components/FrequencyPicker';
import { EmptyState } from '../../src/components/EmptyState';
import { useTasks } from '../../src/context/TaskContext';
import { useGamification } from '../../src/context/GamificationContext';
import { Frequency } from '../../src/types';
import { getTaskStatus } from '../../src/utils/scheduling';
import { calculateXPForCompletion } from '../../src/utils/xp';
import { getSuggestedTasks } from '../../src/constants/rooms';
import { formatFrequency } from '../../src/utils/scheduling';
import { colors, fonts, fontSize, spacing, borderRadius } from '../../src/constants/theme';

export default function RoomDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { rooms, tasks, addTask, removeRoom, completeTask } = useTasks();
  const { awardXP, recordCompletion } = useGamification();

  const room = rooms.find((r) => r.id === id);
  const roomTasks = tasks.filter((t) => t.roomId === id);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newFrequency, setNewFrequency] = useState<Frequency>({ value: 1, unit: 'weeks' });

  if (!room) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState emoji="❓" title="Room not found" />
        <Button title="Go Back" onPress={() => router.back()} variant="outline" />
      </SafeAreaView>
    );
  }

  const suggestions = getSuggestedTasks(room.name).filter(
    (s) => !roomTasks.some((t) => t.name.toLowerCase() === s.name.toLowerCase())
  );

  const handleAddCustom = () => {
    const trimmed = newTaskName.trim();
    if (!trimmed) return;
    addTask(id!, trimmed, newFrequency);
    setNewTaskName('');
    setShowAddForm(false);
  };

  const handleComplete = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const xp = calculateXPForCompletion(task);
    const wasOnTime = getTaskStatus(task) !== 'overdue';
    completeTask(taskId, xp, wasOnTime);
    awardXP(xp);
    recordCompletion();
  };

  const handleDeleteRoom = () => {
    Alert.alert(
      'Delete Room',
      `Delete "${room.name}" and all its tasks? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeRoom(room.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Button title="← Back" onPress={() => router.back()} variant="ghost" size="sm" />
          <Text style={styles.title}>
            {room.icon} {room.name}
          </Text>
          <Text style={styles.taskCount}>{roomTasks.length} tasks</Text>
        </View>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick add</Text>
            <View style={styles.suggestions}>
              {suggestions.slice(0, 4).map((s) => (
                <Button
                  key={s.name}
                  title={`${s.name} · ${formatFrequency(s.frequency)}`}
                  onPress={() => addTask(id!, s.name, s.frequency)}
                  variant="outline"
                  size="sm"
                  style={styles.suggestionBtn}
                />
              ))}
            </View>
          </View>
        )}

        {/* Add form */}
        {showAddForm ? (
          <Card style={styles.addForm}>
            <Text style={styles.sectionTitle}>New task</Text>
            <TextInput
              placeholder="Task name"
              value={newTaskName}
              onChangeText={setNewTaskName}
              autoFocus
            />
            <FrequencyPicker value={newFrequency} onChange={setNewFrequency} />
            <View style={styles.formButtons}>
              <Button title="Cancel" onPress={() => setShowAddForm(false)} variant="ghost" size="sm" />
              <Button title="Add" onPress={handleAddCustom} size="sm" disabled={!newTaskName.trim()} />
            </View>
          </Card>
        ) : (
          <Button
            title="+ Add Custom Task"
            onPress={() => setShowAddForm(true)}
            variant="outline"
            size="md"
            style={styles.addButton}
          />
        )}

        {/* Task list */}
        {roomTasks.length === 0 ? (
          <EmptyState emoji="📋" title="No tasks yet" subtitle="Add tasks above to get started" />
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tasks</Text>
            {roomTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                showRoom={false}
                onPress={() => router.push(`/task/${task.id}`)}
                onComplete={() => handleComplete(task.id)}
              />
            ))}
          </View>
        )}

        {/* Delete room */}
        <View style={styles.dangerZone}>
          <Button title="Delete Room" onPress={handleDeleteRoom} variant="ghost" size="sm" textStyle={styles.deleteText} />
        </View>
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
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xxl,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  taskCount: {
    fontFamily: fonts.regular,
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  suggestionBtn: {
    borderColor: colors.border,
  },
  addForm: {
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  addButton: {
    marginBottom: spacing.lg,
  },
  dangerZone: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  deleteText: {
    color: colors.danger,
  },
});
