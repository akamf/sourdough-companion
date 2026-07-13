import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useGlobalSearchParams, Link } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { AppScreen } from '@/components/AppScreen';
import { AppText } from '@/components/AppText';
import { spacing } from '@/constants/spacing';
import { colors } from '@/constants/colors';

export default function AuthCallback() {
  const params = useGlobalSearchParams<{ code?: string }>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.code) return;
    supabase.auth.exchangeCodeForSession(params.code).then(({ error }) => {
      if (error) setError(error.message);
    });
  }, [params.code]);

  if (error) {
    return (
      <AppScreen>
        <View style={styles.container}>
          <AppText variant="heading" weight="semibold">
            Link expired or already used
          </AppText>
          <AppText variant="body" color="muted">
            {error}
          </AppText>
          <Link href="/(auth)/login">
            <AppText variant="body" color="accent" weight="medium">
              Back to sign in
            </AppText>
          </Link>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <View style={styles.container}>
        <ActivityIndicator color={colors.rye} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
