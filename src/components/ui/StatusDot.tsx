import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TaskStatus } from '../../types';
import { statusColors } from '../../constants/theme';

interface StatusDotProps {
  status: TaskStatus;
  size?: number;
}

export function StatusDot({ status, size = 12 }: StatusDotProps) {
  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: statusColors[status],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
});
