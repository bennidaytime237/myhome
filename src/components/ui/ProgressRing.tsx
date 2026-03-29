import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors, fonts, fontSize } from '../../constants/theme';

interface ProgressRingProps {
  progress: number; // 0-1
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
  label?: string;
}

export function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 8,
  color = colors.primary,
  backgroundColor = colors.border,
  showLabel = true,
  label,
}: ProgressRingProps) {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const percentage = Math.round(clampedProgress * 100);

  // Simple visual ring using nested views with border
  const outerSize = size;
  const innerSize = size - strokeWidth * 2;

  return (
    <View style={[styles.container, { width: outerSize, height: outerSize }]}>
      {/* Background ring */}
      <View
        style={[
          styles.ring,
          {
            width: outerSize,
            height: outerSize,
            borderRadius: outerSize / 2,
            borderWidth: strokeWidth,
            borderColor: backgroundColor,
          },
        ]}
      />
      {/* Progress overlay - using a simple approach with border coloring */}
      <View
        style={[
          styles.ring,
          {
            width: outerSize,
            height: outerSize,
            borderRadius: outerSize / 2,
            borderWidth: strokeWidth,
            borderColor: color,
            borderRightColor: clampedProgress > 0.25 ? color : 'transparent',
            borderBottomColor: clampedProgress > 0.5 ? color : 'transparent',
            borderLeftColor: clampedProgress > 0.75 ? color : 'transparent',
            borderTopColor: clampedProgress > 0 ? color : 'transparent',
            opacity: clampedProgress === 0 ? 0 : 1,
            transform: [{ rotate: '-90deg' }],
          },
        ]}
      />
      {/* Center content */}
      <View
        style={[
          styles.center,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
          },
        ]}
      >
        {showLabel && (
          <Text style={[styles.label, { fontSize: size > 60 ? fontSize.md : fontSize.xs }]}>
            {label || `${percentage}%`}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
  },
  center: {
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.semibold,
    color: colors.textPrimary,
  },
});
