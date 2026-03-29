import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Frequency, FrequencyUnit } from '../types';
import { colors, fonts, fontSize, spacing, borderRadius } from '../constants/theme';

interface FrequencyPickerProps {
  value: Frequency;
  onChange: (frequency: Frequency) => void;
}

const PRESETS: { label: string; frequency: Frequency }[] = [
  { label: 'Daily', frequency: { value: 1, unit: 'days' } },
  { label: 'Weekly', frequency: { value: 1, unit: 'weeks' } },
  { label: '2 Weeks', frequency: { value: 2, unit: 'weeks' } },
  { label: 'Monthly', frequency: { value: 1, unit: 'months' } },
  { label: '3 Months', frequency: { value: 3, unit: 'months' } },
  { label: '6 Months', frequency: { value: 6, unit: 'months' } },
];

const UNITS: { label: string; value: FrequencyUnit }[] = [
  { label: 'Days', value: 'days' },
  { label: 'Weeks', value: 'weeks' },
  { label: 'Months', value: 'months' },
];

export function FrequencyPicker({ value, onChange }: FrequencyPickerProps) {
  const isPresetSelected = (preset: Frequency) =>
    preset.value === value.value && preset.unit === value.unit;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>How often?</Text>
      <View style={styles.presets}>
        {PRESETS.map((preset) => (
          <TouchableOpacity
            key={preset.label}
            style={[styles.preset, isPresetSelected(preset.frequency) && styles.presetSelected]}
            onPress={() => onChange(preset.frequency)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.presetText,
                isPresetSelected(preset.frequency) && styles.presetTextSelected,
              ]}
            >
              {preset.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.custom}>
        <Text style={styles.customLabel}>Or custom:</Text>
        <View style={styles.customRow}>
          <View style={styles.numberRow}>
            <TouchableOpacity
              style={styles.stepButton}
              onPress={() => onChange({ ...value, value: Math.max(1, value.value - 1) })}
            >
              <Text style={styles.stepText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.numberText}>{value.value}</Text>
            <TouchableOpacity
              style={styles.stepButton}
              onPress={() => onChange({ ...value, value: Math.min(52, value.value + 1) })}
            >
              <Text style={styles.stepText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.unitRow}>
            {UNITS.map((unit) => (
              <TouchableOpacity
                key={unit.value}
                style={[styles.unitButton, value.unit === unit.value && styles.unitSelected]}
                onPress={() => onChange({ ...value, unit: unit.value })}
              >
                <Text
                  style={[
                    styles.unitText,
                    value.unit === unit.value && styles.unitTextSelected,
                  ]}
                >
                  {unit.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  preset: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  presetText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  presetTextSelected: {
    color: colors.white,
  },
  custom: {
    gap: spacing.sm,
  },
  customLabel: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stepButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },
  numberText: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xl,
    color: colors.textPrimary,
    minWidth: 30,
    textAlign: 'center',
  },
  unitRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    flex: 1,
  },
  unitButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  unitSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  unitText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.xs,
    color: colors.textPrimary,
  },
  unitTextSelected: {
    color: colors.white,
  },
});
