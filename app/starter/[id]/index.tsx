import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppScreen } from '@/components/AppScreen';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { LoadingState } from '@/components/LoadingState';
import { spacing } from '@/constants/spacing';

export default function StarterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  if (!id) return <LoadingState />;

  return (
    <AppScreen scroll>
      <View style={styles.header}>
        <AppButton
          title="← Back"
          variant="ghost"
          size="sm"
          onPress={() => router.back()}
        />
        <AppText variant="title" weight="bold" color="accent">
          Starter Detail
        </AppText>
      </View>

      <AppText variant="body" color="muted">
        Loading starter {id}...
      </AppText>

      <View style={styles.actions}>
        <AppButton
          title="Feed"
          onPress={() => router.push(`/starter/${id}/feed`)}
          size="lg"
        />
        <AppButton
          title="Add event"
          variant="secondary"
          onPress={() => router.push(`/starter/${id}/event`)}
          size="lg"
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  actions: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
});
