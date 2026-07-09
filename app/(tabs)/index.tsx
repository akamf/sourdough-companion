import React from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { AppScreen } from '@/components/AppScreen';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { StarterCard } from '@/components/StarterCard';
import { SectionHeader } from '@/components/SectionHeader';
import { useAuth } from '@/context/AuthContext';
import { useStartersWithStats } from '@/hooks/useStarterWithStats';
import { spacing } from '@/constants/spacing';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: starters, isLoading, refetch, isRefetching } = useStartersWithStats();

  const today = format(new Date(), 'EEEE, MMM d');

  if (isLoading) return <LoadingState message="Loading your starters..." />;

  return (
    <AppScreen
      scroll
      scrollProps={{
        refreshControl: (
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        ),
      }}
    >
      <View style={styles.header}>
        <AppText variant="caption" color="muted" weight="medium">
          {today}
        </AppText>
        <AppText variant="title" weight="bold" color="accent">
          {greeting()}
        </AppText>
      </View>

      {!starters?.length ? (
        <EmptyState
          icon="🫙"
          title="No starters yet"
          message="Add your first sourdough starter to begin tracking feedings, streaks, and your baking journey."
          actionLabel="Add starter"
          onAction={() => router.push('/starter/new')}
        />
      ) : (
        <View style={styles.list}>
          <SectionHeader
            title="Your starters"
            actionLabel="Add"
            onAction={() => router.push('/starter/new')}
          />
          {starters.map(({ starter, lastFedAt, feedStatus, careStreak }) => (
            <StarterCard
              key={starter.id}
              starter={starter}
              lastFedAt={lastFedAt}
              feedStatus={feedStatus}
              careStreak={careStreak}
              onPress={() => router.push(`/starter/${starter.id}`)}
              onFeed={() => router.push(`/starter/${starter.id}/feed`)}
            />
          ))}
        </View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
    gap: 2,
  },
  list: {
    gap: spacing.sm,
  },
});
