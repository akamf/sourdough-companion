import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { AppText } from '../AppText';
import { TimelineIcon } from './TimelineIcon';
import type { Database } from '@/lib/types/database';
import { spacing } from '@/constants/spacing';
import { colors } from '@/constants/colors';
import { format } from 'date-fns';
import { EVENT_TYPES } from '@/lib/schemas/starter';

type TimelineEvent = Database['public']['Tables']['timeline_events']['Row'];

interface EventTimelineItemProps {
  data: TimelineEvent;
  isLast?: boolean;
}

export function EventTimelineItem({ data, isLast }: EventTimelineItemProps) {
  const typeLabel =
    EVENT_TYPES[data.event_type as keyof typeof EVENT_TYPES] ?? data.event_type;

  return (
    <View style={styles.container}>
      <View style={styles.iconCol}>
        <TimelineIcon type={data.event_type} />
        {!isLast && <View style={styles.line} />}
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <View style={styles.titleRow}>
            <AppText variant="body" weight="semibold">
              {data.title}
            </AppText>
            <AppText variant="micro" color="muted" weight="medium" style={styles.type}>
              {typeLabel.toUpperCase()}
            </AppText>
          </View>
          <AppText variant="caption" color="muted">
            {format(new Date(data.event_date), 'h:mm a')}
          </AppText>
        </View>

        {data.comment && (
          <AppText variant="caption" color="muted" style={styles.comment}>
            {data.comment}
          </AppText>
        )}

        {data.rating && (
          <AppText variant="caption">
            {'★'.repeat(data.rating)}{'☆'.repeat(5 - data.rating)}
          </AppText>
        )}

        {data.recipe_url && (
          <TouchableOpacity onPress={() => Linking.openURL(data.recipe_url!)}>
            <AppText variant="caption" color="accent" weight="medium">
              View recipe →
            </AppText>
          </TouchableOpacity>
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: spacing.xs + 2,
  },
  titleRow: {
    flex: 1,
    gap: 2,
  },
  type: {
    letterSpacing: 0.5,
  },
  comment: {
    fontStyle: 'italic',
  },
});
