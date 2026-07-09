import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppScreen } from '@/components/AppScreen';
import { AppText } from '@/components/AppText';
import { EmptyState } from '@/components/EmptyState';
import { spacing } from '@/constants/spacing';
import { colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <AppScreen scroll>
      <View style={styles.header}>
        <AppText variant="subheading" color="muted">
          Good morning
        </AppText>
        <AppText variant="title" weight="bold" color="accent">
          Your starters
        </AppText>
      </View>

      <EmptyState
        icon="🫙"
        title="No starters yet"
        message="Add your first sourdough starter to begin tracking feedings, streaks, and your baking journey."
        actionLabel="Add starter"
        onAction={() => router.push('/starter/new' as any)}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
    gap: 2,
  },
});
