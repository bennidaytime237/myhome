import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task, Room } from '../types';
import { Card } from './ui/Card';
import { StatusDot } from './ui/StatusDot';
import { colors, fonts, fontSize, spacing } from '../constants/theme';
import { getTaskStatus, formatDueText, formatFrequency } from '../utils/scheduling';

interface TaskCardProps {
  task: Task;
  room?: Room;
  onPress?: () => void;
  onComplete?: () => void;
  showRoom?: boolean;
}

export function TaskCard({ task, room, onPress, onComplete, showRoom = true }: TaskCardProps) {
  const status = getTaskStatus(task);
  const dueText = formatDueText(task);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <StatusDot status={status} size={14} />
          <View style={styles.content}>
            <Text style={styles.name}>{task.name}</Text>
            <View style={styles.meta}>
              {showRoom && room && (
                <Text style={styles.room}>
                  {room.icon} {room.name}
                </Text>
              )}
              <Text style={[styles.due, status === 'overdue' && styles.overdue]}>
                {dueText}
              </Text>
            </View>
            <Text style={styles.frequency}>{formatFrequency(task.frequency)}</Text>
          </View>
          {onComplete && (
            <TouchableOpacity style={styles.doneButton} onPress={onComplete} activeOpacity={0.6}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  content: {
    flex: 1,
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 2,
  },
  room: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  due: {
    fontFamily: fonts.medium,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  overdue: {
    color: colors.danger,
  },
  frequency: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  doneButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  doneText: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.sm,
    color: colors.white,
  },
});
