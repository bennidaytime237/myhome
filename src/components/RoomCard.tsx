import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Room, Task } from '../types';
import { Card } from './ui/Card';
import { colors, fonts, fontSize, spacing } from '../constants/theme';
import { statusColors } from '../constants/theme';
import { getTaskStatus } from '../utils/scheduling';

interface RoomCardProps {
  room: Room;
  tasks: Task[];
  onPress?: () => void;
}

export function RoomCard({ room, tasks, onPress }: RoomCardProps) {
  const overdue = tasks.filter((t) => getTaskStatus(t) === 'overdue').length;
  const dueSoon = tasks.filter((t) => getTaskStatus(t) === 'due_soon').length;
  const fresh = tasks.filter((t) => getTaskStatus(t) === 'fresh').length;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.icon}>{room.icon}</Text>
          <Text style={styles.name}>{room.name}</Text>
          <Text style={styles.count}>{tasks.length} tasks</Text>
        </View>
        {tasks.length > 0 && (
          <View style={styles.statusRow}>
            {overdue > 0 && (
              <View style={[styles.statusPill, { backgroundColor: statusColors.overdue + '30' }]}>
                <View style={[styles.statusDot, { backgroundColor: statusColors.overdue }]} />
                <Text style={[styles.statusText, { color: statusColors.overdue }]}>
                  {overdue} overdue
                </Text>
              </View>
            )}
            {dueSoon > 0 && (
              <View style={[styles.statusPill, { backgroundColor: statusColors.due_soon + '30' }]}>
                <View style={[styles.statusDot, { backgroundColor: statusColors.due_soon }]} />
                <Text style={[styles.statusText, { color: '#B8960F' }]}>
                  {dueSoon} due soon
                </Text>
              </View>
            )}
            {fresh > 0 && (
              <View style={[styles.statusPill, { backgroundColor: statusColors.fresh + '30' }]}>
                <View style={[styles.statusDot, { backgroundColor: statusColors.fresh }]} />
                <Text style={[styles.statusText, { color: '#5A9E6F' }]}>
                  {fresh} on track
                </Text>
              </View>
            )}
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  icon: {
    fontSize: 24,
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    flex: 1,
  },
  count: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
    flexWrap: 'wrap',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.xs,
  },
});
