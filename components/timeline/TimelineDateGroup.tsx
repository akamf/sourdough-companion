import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../AppText';
import { spacing } from '@/constants/spacing';
import { colors } from '@/constants/colors';
import { format, isToday, isYesterday } from 'date-fns';

interface TimelineDateGroupProps {
  date: Date;
}

export function TimelineDateGroup({ date }: TimelineDateGroupProps) {
  let label: string;
  if (isToday(date)) {
    label = 'Today';
  } else if (isYesterday(date)) {
    label = 'Yesterday';
  } else {
    label = format(date, 'EEEE, MMM d');
  }

  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <AppText variant="micro" weight="semibold" style={styles.label}>
        {label}
      </AppText>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.sm,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.creamBorder,
  },
  label: {
    color: colors.warmGray,
    letterSpacing: 0.5,
  },
});
