import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../AppText';
import { AppCard } from '../AppCard';
import { TimelineIcon } from './TimelineIcon';
import type { Database } from '@/lib/types/database';
import { spacing } from '@/constants/spacing';
import { colors } from '@/constants/colors';
import { format } from 'date-fns';

type FeedingLog = Database['public']['Tables']['feeding_logs']['Row'];

interface FeedingTimelineItemProps {
  data: FeedingLog;
}

export function FeedingTimelineItem({ data }: FeedingTimelineItemProps) {
  const hasMeasurements = data.flour_g || data.water_g || data.starter_kept_g;

  return (
    <View style={styles.container}>
      <View style={styles.iconCol}>
        <TimelineIcon type="feeding" />
        <View style={styles.line} />
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <AppText variant="body" weight="semibold">
            Feeding
          </AppText>
          <AppText variant="caption" color="muted">
            {format(new Date(data.fed_at), 'h:mm a')}
          </AppText>
        </View>
        {hasMeasurements && (
          <AppCard style={styles.measurements} elevated={false}>
            <View style={styles.measureRow}>
              {data.starter_kept_g != null && (
                <MeasurePill label="Kept" value={`${data.starter_kept_g}g`} />
              )}
              {data.flour_g != null && (
                <MeasurePill label="Flour" value={`${data.flour_g}g`} />
              )}
              {data.water_g != null && (
                <MeasurePill label="Water" value={`${data.water_g}g`} />
              )}
            </View>
            {data.flour_type && (
              <AppText variant="caption" color="muted">
                {data.flour_type}
              </AppText>
            )}
          </AppCard>
        )}
        {data.notes && (
          <AppText variant="caption" color="muted" style={styles.notes}>
            {data.notes}
          </AppText>
        )}
      </View>
    </View>
  );
}

function MeasurePill({ label, value }: { label: string; value: string }) {
  return (
    <View style={pillStyles.pill}>
      <AppText variant="micro" color="muted" weight="medium">
        {label}
      </AppText>
      <AppText variant="caption" weight="semibold">
        {value}
      </AppText>
    </View>
  );
}

const pillStyles = StyleSheet.create({
  pill: {
    alignItems: 'center',
    gap: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.creamDark,
    borderRadius: 8,
  },
});

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
  measurements: {
    gap: spacing.sm,
    backgroundColor: colors.creamDark,
    borderColor: colors.creamBorder,
    padding: spacing.sm,
  },
  measureRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  notes: {
    fontStyle: 'italic',
  },
});
