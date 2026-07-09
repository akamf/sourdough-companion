import React from 'react';
import { View, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppScreen } from '@/components/AppScreen';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { SectionHeader } from '@/components/SectionHeader';
import { useStarter } from '@/hooks/useStarters';
import { useFeedingLogs } from '@/hooks/useFeedingLogs';
import { useUnifiedTimeline } from '@/hooks/useTimeline';
import {
  getLastFedAt,
  getNextFeedAt,
  getFeedStatus,
  getFeedStatusLabel,
  getCurrentCareStreak,
  getLongestCareStreak,
  formatLastFed,
} from '@/lib/utils/streak';
import { STARTER_STATUSES, STORAGE_MODES } from '@/lib/schemas/starter';
import { spacing, radius } from '@/constants/spacing';
import { colors } from '@/constants/colors';
import { TimelineList } from '@/components/timeline/TimelineList';
import { StarterGuidance } from '@/components/StarterGuidance';

export default function StarterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: starter, isLoading: starterLoading, refetch } = useStarter(id ?? '');
  const { data: logs = [], isLoading: logsLoading } = useFeedingLogs(id ?? '');
  const { data: timeline = [], isLoading: tlLoading, refetch: refetchTl } = useUnifiedTimeline(id ?? '');

  if (starterLoading || logsLoading) return <LoadingState />;
  if (!starter) return <EmptyState title="Starter not found" icon="🤔" />;

  const lastFedAt = getLastFedAt(logs);
  const feedStatus = getFeedStatus(logs, starter.storage_mode);
  const careStreak = getCurrentCareStreak(logs);
  const longestStreak = getLongestCareStreak(logs);
  const statusLabel = getFeedStatusLabel(feedStatus, starter.name);
  const nextFeedAt = getNextFeedAt(lastFedAt, starter.storage_mode);

  return (
    <AppScreen
      scroll
      scrollProps={{
        refreshControl: (
          <RefreshControl
            refreshing={false}
            onRefresh={() => { refetch(); refetchTl(); }}
          />
        ),
      }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <AppText variant="body" color="accent" weight="medium">
            ← Back
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Starter title + status */}
      <View style={styles.titleRow}>
        <View style={styles.titleInfo}>
          <AppText variant="display" weight="bold" color="accent">
            {starter.name}
          </AppText>
          <AppText variant="body" color="muted">
            {starter.flour_base} · {starter.hydration_percent}% hydration
          </AppText>
        </View>
        <View style={styles.jar}>
          <AppText style={styles.jarEmoji}>🫙</AppText>
        </View>
      </View>

      {/* Status message */}
      <AppCard style={styles.statusCard}>
        <AppText variant="body" weight="semibold">
          {statusLabel}
        </AppText>
        <AppText variant="caption" color="muted">
          {formatLastFed(lastFedAt)}
          {nextFeedAt
            ? ` · Next feed around ${nextFeedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            : ''}
        </AppText>
      </AppCard>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <StatBox label="Care streak" value={careStreak > 0 ? `🔥 ${careStreak}d` : '—'} />
        <StatBox label="Best streak" value={longestStreak > 0 ? `${longestStreak}d` : '—'} />
        <StatBox
          label="Status"
          value={STARTER_STATUSES[starter.status as keyof typeof STARTER_STATUSES] ?? starter.status}
        />
        <StatBox
          label="Storage"
          value={STORAGE_MODES[starter.storage_mode as keyof typeof STORAGE_MODES] ?? starter.storage_mode}
        />
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <AppButton
          title="Feed"
          onPress={() => router.push(`/starter/${id}/feed`)}
          size="lg"
          style={styles.feedBtn}
        />
        <AppButton
          title="Add event"
          variant="secondary"
          onPress={() => router.push(`/starter/${id}/event`)}
          size="lg"
          style={styles.eventBtn}
        />
        <AppButton
          title="🔔"
          variant="secondary"
          size="lg"
          onPress={() => router.push(`/starter/${id}/notifications`)}
          style={styles.notifBtn}
        />
      </View>

      {/* Guidance */}
      <StarterGuidance
        starterName={starter.name}
        startedAt={starter.started_at}
        status={starter.status}
        storageMode={starter.storage_mode}
      />

      {/* Readiness check shortcut */}
      {(starter.status === 'starting' || starter.status === 'establishing') && (
        <AppButton
          title="Check readiness"
          variant="secondary"
          size="md"
          onPress={() => router.push(`/starter/${id}/readiness`)}
          style={styles.readinessBtn}
        />
      )}

      {/* Timeline */}
      <View style={styles.timelineSection}>
        <SectionHeader title="Timeline" />
        {tlLoading ? (
          <LoadingState />
        ) : timeline.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No activity yet"
            message="Feed your starter or add an event to begin the timeline."
          />
        ) : (
          <TimelineList items={timeline} />
        )}
      </View>
    </AppScreen>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={statStyles.box}>
      <AppText variant="micro" color="muted" weight="medium" style={statStyles.label}>
        {label.toUpperCase()}
      </AppText>
      <AppText variant="caption" weight="semibold">
        {value}
      </AppText>
    </View>
  );
}

const statStyles = StyleSheet.create({
  box: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  label: {
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  titleInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  jar: {
    marginLeft: spacing.md,
  },
  jarEmoji: {
    fontSize: 48,
  },
  statusCard: {
    gap: spacing.xs,
    marginBottom: spacing.md,
    backgroundColor: colors.creamDark,
    borderColor: colors.creamBorder,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.creamBorder,
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  feedBtn: {
    flex: 2,
  },
  eventBtn: {
    flex: 1,
  },
  notifBtn: {
    width: 48,
    paddingHorizontal: 0,
  },
  readinessBtn: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    alignSelf: 'flex-start',
  },
  timelineSection: {
    gap: spacing.sm,
  },
});
