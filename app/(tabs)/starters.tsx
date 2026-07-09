import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AppScreen } from '@/components/AppScreen';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { EmptyState } from '@/components/EmptyState';
import { SectionHeader } from '@/components/SectionHeader';
import { spacing } from '@/constants/spacing';

export default function StartersScreen() {
  const router = useRouter();

  return (
    <AppScreen scroll>
      <View style={styles.header}>
        <AppText variant="title" weight="bold" color="accent">
          Starters
        </AppText>
        <AppButton
          title="+ New"
          size="sm"
          onPress={() => router.push('/starter/new' as any)}
        />
      </View>

      <EmptyState
        icon="🫙"
        title="No starters yet"
        message="Each starter gets its own timeline, streak, and feeding schedule."
        actionLabel="Add your first starter"
        onAction={() => router.push('/starter/new' as any)}
      />
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
});
