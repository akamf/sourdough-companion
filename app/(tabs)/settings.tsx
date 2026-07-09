import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { AppScreen } from '@/components/AppScreen';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { spacing } from '@/constants/spacing';
import { colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <AppScreen scroll>
      <View style={styles.header}>
        <AppText variant="title" weight="bold" color="accent">
          Settings
        </AppText>
      </View>

      <AppCard style={styles.card}>
        <AppText variant="caption" color="muted" weight="medium" style={styles.label}>
          SIGNED IN AS
        </AppText>
        <AppText variant="body" weight="medium">
          {user?.email ?? '—'}
        </AppText>
      </AppCard>

      <View style={styles.actions}>
        <AppButton
          title="Sign out"
          variant="danger"
          onPress={handleSignOut}
          size="md"
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
  },
  card: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  label: {
    letterSpacing: 0.6,
  },
  actions: {
    gap: spacing.sm,
  },
});
