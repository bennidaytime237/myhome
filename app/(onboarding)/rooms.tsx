import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/ui/Button';
import { TextInput } from '../../src/components/ui/TextInput';
import { Card } from '../../src/components/ui/Card';
import { useTasks } from '../../src/context/TaskContext';
import { ROOM_SUGGESTIONS } from '../../src/constants/rooms';
import { colors, fonts, fontSize, spacing, borderRadius } from '../../src/constants/theme';

export default function RoomsScreen() {
  const router = useRouter();
  const { rooms, addRoom, removeRoom } = useTasks();
  const [customName, setCustomName] = useState('');

  const addedNames = rooms.map((r) => r.name.toLowerCase());

  const handleAddSuggestion = (name: string, icon: string) => {
    if (addedNames.includes(name.toLowerCase())) {
      const room = rooms.find((r) => r.name.toLowerCase() === name.toLowerCase());
      if (room) removeRoom(room.id);
    } else {
      addRoom(name, icon);
    }
  };

  const handleAddCustom = () => {
    const trimmed = customName.trim();
    if (!trimmed || addedNames.includes(trimmed.toLowerCase())) return;
    addRoom(trimmed, '🏠');
    setCustomName('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.step}>Step 1 of 3</Text>
        <Text style={styles.title}>Add Your Rooms</Text>
        <Text style={styles.subtitle}>
          Tap to select the rooms in your home, or add your own
        </Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.suggestions}>
          {ROOM_SUGGESTIONS.map((suggestion) => {
            const isAdded = addedNames.includes(suggestion.name.toLowerCase());
            return (
              <TouchableOpacity
                key={suggestion.name}
                style={[styles.chip, isAdded && styles.chipSelected]}
                onPress={() => handleAddSuggestion(suggestion.name, suggestion.icon)}
                activeOpacity={0.7}
              >
                <Text style={styles.chipIcon}>{suggestion.icon}</Text>
                <Text style={[styles.chipText, isAdded && styles.chipTextSelected]}>
                  {suggestion.name}
                </Text>
                {isAdded && <Text style={styles.chipCheck}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.customSection}>
          <TextInput
            label="Add a custom room"
            placeholder="e.g., Pantry, Attic, Playroom"
            value={customName}
            onChangeText={setCustomName}
            onSubmitEditing={handleAddCustom}
            returnKeyType="done"
          />
          {customName.trim().length > 0 && (
            <Button title="Add Room" onPress={handleAddCustom} variant="outline" size="sm" />
          )}
        </View>

        {rooms.length > 0 && (
          <View style={styles.selected}>
            <Text style={styles.selectedLabel}>Your rooms ({rooms.length})</Text>
            {rooms.map((room) => (
              <Card key={room.id} style={styles.roomCard}>
                <View style={styles.roomRow}>
                  <Text style={styles.roomIcon}>{room.icon}</Text>
                  <Text style={styles.roomName}>{room.name}</Text>
                  <TouchableOpacity onPress={() => removeRoom(room.id)}>
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Next: Add Tasks"
          onPress={() => router.push('/(onboarding)/tasks')}
          size="lg"
          disabled={rooms.length === 0}
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  chipIcon: {
    fontSize: 18,
  },
  chipText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  chipTextSelected: {
    color: colors.primary,
  },
  chipCheck: {
    fontFamily: fonts.bold,
    fontSize: fontSize.sm,
    color: colors.primary,
  },
  customSection: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  selected: {
    gap: spacing.sm,
  },
  selectedLabel: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  roomCard: {
    marginBottom: spacing.xs,
  },
  roomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  roomIcon: {
    fontSize: 20,
  },
  roomName: {
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    flex: 1,
  },
  removeText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.danger,
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
