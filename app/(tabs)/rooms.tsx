import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RoomCard } from '../../src/components/RoomCard';
import { EmptyState } from '../../src/components/EmptyState';
import { Button } from '../../src/components/ui/Button';
import { TextInput } from '../../src/components/ui/TextInput';
import { useTasks } from '../../src/context/TaskContext';
import { ROOM_SUGGESTIONS } from '../../src/constants/rooms';
import { colors, fonts, fontSize, spacing } from '../../src/constants/theme';

export default function RoomsScreen() {
  const router = useRouter();
  const { rooms, tasks, addRoom } = useTasks();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const suggestion = ROOM_SUGGESTIONS.find(
      (s) => s.name.toLowerCase() === trimmed.toLowerCase()
    );
    addRoom(trimmed, suggestion?.icon || '🏠');
    setNewName('');
    setShowAdd(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Rooms</Text>
          <Button
            title={showAdd ? 'Cancel' : '+ Add'}
            onPress={() => setShowAdd(!showAdd)}
            variant={showAdd ? 'ghost' : 'outline'}
            size="sm"
          />
        </View>

        {showAdd && (
          <View style={styles.addForm}>
            <TextInput
              placeholder="Room name"
              value={newName}
              onChangeText={setNewName}
              onSubmitEditing={handleAdd}
              returnKeyType="done"
              autoFocus
            />
            <Button title="Add Room" onPress={handleAdd} size="sm" disabled={!newName.trim()} />
          </View>
        )}

        {rooms.length === 0 ? (
          <EmptyState
            emoji="🏠"
            title="No rooms yet"
            subtitle="Add your first room to get started"
          />
        ) : (
          rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              tasks={tasks.filter((t) => t.roomId === room.id)}
              onPress={() => router.push(`/room/${room.id}`)}
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
  addForm: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
});
