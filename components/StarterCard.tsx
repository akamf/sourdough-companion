import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from './AppText';
import { AppCard } from './AppCard';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/spacing';
import type { Database } from '@/lib/types/database';
import type { FeedStatus } from '@/lib/utils/streak';
import { formatLastFed, getFeedStatusLabel } from '@/lib/utils/streak';

type Starter = Database['public']['Tables']['starters']['Row'];

interface StarterCardProps {
  starter: Starter;
  lastFedAt: Date | null;
  feedStatus: FeedStatus;
  careStreak: number;
  onPress: () => void;
  onFeed?: () => void;
}

const statusColors: Record<FeedStatus, { bg: string; text: string; dot: string }> = {
  fed_today: { bg: colors.greenLight, text: colors.green, dot: colors.green },
  due_soon: { bg: colors.orangeLight, text: colors.orange, dot: colors.orange },
  due_today: { bg: colors.orangeLight, text: colors.orange, dot: colors.orange },
  overdue: { bg: colors.redLight, text: colors.red, dot: colors.red },
  fridge: { bg: colors.creamDark, text: colors.warmGray, dot: colors.warmGrayLight },
  unknown: { bg: colors.creamDark, text: colors.warmGray, dot: colors.warmGrayLight },
};

export function StarterCard({
  starter,
  lastFedAt,
  feedStatus,
  careStreak,
  onPress,
  onFeed,
}: StarterCardProps) {
  const statusColor = statusColors[feedStatus];
  const statusLabel = getFeedStatusLabel(feedStatus, starter.name);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <AppCard style={styles.card}>
        <View style={styles.row}>
          <View style={styles.info}>
            <AppText variant="subheading" weight="semibold" color="default">
              {starter.name}
            </AppText>
            <AppText variant="caption" color="muted">
              {starter.flour_base} · {starter.hydration_percent}% hydration
            </AppText>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor.dot }]} />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <AppText variant="micro" color="muted" weight="medium" style={styles.footerLabel}>
              LAST FED
            </AppText>
            <AppText variant="caption" weight="medium">
              {formatLastFed(lastFedAt)}
            </AppText>
          </View>

          {careStreak > 0 && (
            <View style={styles.footerItem}>
              <AppText variant="micro" color="muted" weight="medium" style={styles.footerLabel}>
                STREAK
              </AppText>
              <AppText variant="caption" weight="medium" color="accent">
                🔥 {careStreak} days
              </AppText>
            </View>
          )}

          <AppText
            variant="caption"
            weight="medium"
            style={[styles.statusText, { color: statusColor.text }]}
          >
            {statusLabel}
          </AppText>
        </View>
      </AppCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
  },
  divider: {
    height: 1,
    backgroundColor: colors.creamBorder,
    marginHorizontal: -spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    flexWrap: 'wrap',
  },
  footerItem: {
    gap: 1,
  },
  footerLabel: {
    letterSpacing: 0.5,
  },
  statusText: {
    marginLeft: 'auto',
    flexShrink: 1,
  },
});
