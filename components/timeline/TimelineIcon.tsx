import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../AppText';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/spacing';

const ICONS: Record<string, { emoji: string; bg: string }> = {
  feeding: { emoji: '🥄', bg: colors.greenLight },
  created: { emoji: '🌱', bg: colors.creamDark },
  bake: { emoji: '🍞', bg: colors.orangeLight },
  discard: { emoji: '🗑️', bg: colors.creamDark },
  observation: { emoji: '👀', bg: colors.creamDark },
  fridge_rest: { emoji: '❄️', bg: '#E8F4FD' },
  revive: { emoji: '⚡', bg: colors.orangeLight },
  problem: { emoji: '⚠️', bg: colors.redLight },
  recipe_test: { emoji: '🧪', bg: colors.orangeLight },
  readiness_check: { emoji: '✅', bg: colors.greenLight },
  status_change: { emoji: '🔄', bg: colors.creamDark },
  custom: { emoji: '📌', bg: colors.creamDark },
  default: { emoji: '📋', bg: colors.creamDark },
};

interface TimelineIconProps {
  type: string;
  size?: 'sm' | 'md';
}

export function TimelineIcon({ type, size = 'md' }: TimelineIconProps) {
  const icon = ICONS[type] ?? ICONS.default;
  const dim = size === 'sm' ? 32 : 40;

  return (
    <View
      style={[
        styles.container,
        { width: dim, height: dim, borderRadius: dim / 2, backgroundColor: icon.bg },
      ]}
    >
      <AppText style={{ fontSize: size === 'sm' ? 14 : 18 }}>{icon.emoji}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
});
