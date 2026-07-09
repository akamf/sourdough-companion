import React from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { AppScreen } from '@/components/AppScreen';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { StarterCard } from '@/components/StarterCard';
import { useStartersWithStats } from '@/hooks/useStarterWithStats';
import { spacing } from '@/constants/spacing';

export default function StartersScreen() {
  const router = useRouter();
  const { data: starters, isLoading, refetch, isRefetching } = useStartersWithStats();

  if (isLoading) return <LoadingState />;

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
        <AppText variant="title" weight="bold" color="accent">
          Starters
        </AppText>
        <AppButton
          title="+ Add"
          size="sm"
          onPress={() => router.push('/starter/new')}
        />
      </View>

      {!starters?.length ? (
        <EmptyState
          icon="🫙"
          title="No starters yet"
          message="Each starter gets its own timeline, streak, and feeding schedule."
          actionLabel="Add your first starter"
          onAction={() => router.push('/starter/new')}
        />
      ) : (
        <View style={styles.list}>
          {starters.map(({ starter, lastFedAt, feedStatus, careStreak }) => (
            <StarterCard
              key={starter.id}
              starter={starter}
              lastFedAt={lastFedAt}
              feedStatus={feedStatus}
              careStreak={careStreak}
              onPress={() => router.push(`/starter/${starter.id}`)}
            />
          ))}
        </View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  list: {
    gap: spacing.sm,
  },
});
