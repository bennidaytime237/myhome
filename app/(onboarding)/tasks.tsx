import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/ui/Button';
import { TextInput } from '../../src/components/ui/TextInput';
import { Card } from '../../src/components/ui/Card';
import { FrequencyPicker } from '../../src/components/FrequencyPicker';
import { useTasks } from '../../src/context/TaskContext';
import { getSuggestedTasks } from '../../src/constants/rooms';
import { Frequency } from '../../src/types';
import { formatFrequency } from '../../src/utils/scheduling';
import { colors, fonts, fontSize, spacing, borderRadius } from '../../src/constants/theme';

export default function TasksScreen() {
  const router = useRouter();
  const { rooms, tasks, addTask, removeTask } = useTasks();
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || '');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newFrequency, setNewFrequency] = useState<Frequency>({ value: 1, unit: 'weeks' });

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
  const roomTasks = tasks.filter((t) => t.roomId === selectedRoomId);
  const suggestions = selectedRoom ? getSuggestedTasks(selectedRoom.name) : [];
  const addedTaskNames = roomTasks.map((t) => t.name.toLowerCase());

  const handleAddSuggestion = (name: string, frequency: Frequency) => {
    if (addedTaskNames.includes(name.toLowerCase())) return;
    addTask(selectedRoomId, name, frequency);
  };

  const handleAddCustom = () => {
    const trimmed = newTaskName.trim();
    if (!trimmed || addedTaskNames.includes(trimmed.toLowerCase())) return;
    addTask(selectedRoomId, trimmed, newFrequency);
    setNewTaskName('');
    setShowAddForm(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.step}>Step 2 of 3</Text>
        <Text style={styles.title}>Add Tasks</Text>
        <Text style={styles.subtitle}>
          Add tasks for each room. We have suggestions to get you started.
        </Text>
      </View>

      {/* Room tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roomTabs}>
        <View style={styles.roomTabsContent}>
          {rooms.map((room) => {
            const isSelected = room.id === selectedRoomId;
            const count = tasks.filter((t) => t.roomId === room.id).length;
            return (
              <TouchableOpacity
                key={room.id}
                style={[styles.roomTab, isSelected && styles.roomTabSelected]}
                onPress={() => {
                  setSelectedRoomId(room.id);
                  setShowAddForm(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.roomTabIcon}>{room.icon}</Text>
                <Text style={[styles.roomTabText, isSelected && styles.roomTabTextSelected]}>
                  {room.name}
                </Text>
                {count > 0 && (
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{count}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Suggestions */}
        {suggestions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suggested tasks</Text>
            <View style={styles.suggestions}>
              {suggestions.map((suggestion) => {
                const isAdded = addedTaskNames.includes(suggestion.name.toLowerCase());
                return (
                  <TouchableOpacity
                    key={suggestion.name}
                    style={[styles.suggestionChip, isAdded && styles.suggestionAdded]}
                    onPress={() => handleAddSuggestion(suggestion.name, suggestion.frequency)}
                    disabled={isAdded}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.suggestionText, isAdded && styles.suggestionTextAdded]}>
                      {suggestion.name}
                    </Text>
                    <Text style={styles.suggestionFreq}>
                      {isAdded ? '✓' : formatFrequency(suggestion.frequency)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Added tasks */}
        {roomTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {selectedRoom?.icon} {selectedRoom?.name} tasks ({roomTasks.length})
            </Text>
            {roomTasks.map((task) => (
              <Card key={task.id} style={styles.taskCard}>
                <View style={styles.taskRow}>
                  <View style={styles.taskInfo}>
                    <Text style={styles.taskName}>{task.name}</Text>
                    <Text style={styles.taskFreq}>{formatFrequency(task.frequency)}</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeTask(task.id)}>
                    <Text style={styles.removeText}>×</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Custom task form */}
        {showAddForm ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add custom task</Text>
            <TextInput
              placeholder="Task name"
              value={newTaskName}
              onChangeText={setNewTaskName}
            />
            <FrequencyPicker value={newFrequency} onChange={setNewFrequency} />
            <View style={styles.formButtons}>
              <Button title="Cancel" onPress={() => setShowAddForm(false)} variant="ghost" size="sm" />
              <Button
                title="Add Task"
                onPress={handleAddCustom}
                size="sm"
                disabled={!newTaskName.trim()}
              />
            </View>
          </View>
        ) : (
          <Button
            title="+ Add Custom Task"
            onPress={() => setShowAddForm(true)}
            variant="outline"
            size="md"
            style={styles.addButton}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Review Setup"
          onPress={() => router.push('/(onboarding)/complete')}
          size="lg"
          disabled={tasks.length === 0}
          style={styles.button}
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
  roomTabs: {
    maxHeight: 50,
    marginBottom: spacing.sm,
  },
  roomTabsContent: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  roomTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roomTabSelected: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  roomTabIcon: {
    fontSize: 16,
  },
  roomTabText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  roomTabTextSelected: {
    color: colors.primary,
  },
  countBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 20,
    alignItems: 'center',
  },
  countText: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    color: colors.white,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
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
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionAdded: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  suggestionText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  suggestionTextAdded: {
    color: colors.primary,
  },
  suggestionFreq: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  taskCard: {
    marginBottom: spacing.xs,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  taskName: {
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  taskFreq: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  removeText: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.danger,
    paddingHorizontal: spacing.sm,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  addButton: {
    marginBottom: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  button: {
    width: '100%',
  },
});
