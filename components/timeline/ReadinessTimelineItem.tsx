import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../AppText';
import { TimelineIcon } from './TimelineIcon';
import type { Database } from '@/lib/types/database';
import { spacing } from '@/constants/spacing';
import { colors } from '@/constants/colors';
import { format } from 'date-fns';

type ReadinessCheck = Database['public']['Tables']['starter_readiness_checks']['Row'];

interface ReadinessTimelineItemProps {
  data: ReadinessCheck;
  isLast?: boolean;
}

const CHECK_LABELS = [
  { key: 'has_bubbles' as const, label: 'Bubbles' },
  { key: 'doubles_predictably' as const, label: 'Doubles reliably' },
  { key: 'pleasant_smell' as const, label: 'Pleasant smell' },
  { key: 'used_successfully' as const, label: 'Used in a bake' },
];

export function ReadinessTimelineItem({ data, isLast }: ReadinessTimelineItemProps) {
  const passed = CHECK_LABELS.filter((c) => data[c.key]).length;
  const total = CHECK_LABELS.length;

  return (
    <View style={styles.container}>
      <View style={styles.iconCol}>
        <TimelineIcon type="readiness_check" />
        {!isLast && <View style={styles.line} />}
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <AppText variant="body" weight="semibold">
            Readiness check
          </AppText>
          <AppText variant="caption" color="muted">
            {format(new Date(data.checked_at), 'h:mm a')}
          </AppText>
        </View>
        <AppText variant="caption" color={passed === total ? 'success' : 'muted'}>
          {passed}/{total} signs of readiness
        </AppText>
        <View style={styles.checks}>
          {CHECK_LABELS.map((c) => (
            <View key={c.key} style={styles.checkRow}>
              <AppText
                variant="micro"
                style={{ color: data[c.key] ? colors.green : colors.warmGrayLight }}
              >
                {data[c.key] ? '✓' : '○'}
              </AppText>
              <AppText
                variant="caption"
                color={data[c.key] ? 'default' : 'muted'}
              >
                {c.label}
              </AppText>
            </View>
          ))}
        </View>
        {data.notes && (
          <AppText variant="caption" color="muted" style={styles.notes}>
            {data.notes}
          </AppText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconCol: {
    alignItems: 'center',
    width: 40,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: colors.creamBorder,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs + 2,
  },
  checks: {
    gap: spacing.xs,
  },
  checkRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  notes: {
    fontStyle: 'italic',
  },
});
