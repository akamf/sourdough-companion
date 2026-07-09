import React from 'react';
import { View, StyleSheet, Switch, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppScreen } from '@/components/AppScreen';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppInput } from '@/components/AppInput';
import { LoadingState } from '@/components/LoadingState';
import { useStarter } from '@/hooks/useStarters';
import { useNotificationSettings, useUpsertNotificationSettings } from '@/hooks/useNotificationSettings';
import { spacing } from '@/constants/spacing';
import { colors } from '@/constants/colors';

const schema = z.object({
  enabled: z.boolean().default(true),
  reminder_time: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:MM format (e.g. 08:00)').nullable(),
});

type FormValues = z.infer<typeof schema>;

export default function NotificationSettingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: starter } = useStarter(id ?? '');
  const { data: settings, isLoading } = useNotificationSettings(id ?? '');
  const upsert = useUpsertNotificationSettings(id ?? '', starter?.name ?? 'starter');

  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      enabled: settings?.enabled ?? true,
      reminder_time: settings?.reminder_time ?? '08:00',
    },
  });

  const enabled = watch('enabled');

  const onSubmit = async (values: FormValues) => {
    try {
      await upsert.mutateAsync(values);
      Alert.alert('Saved', enabled ? 'Reminder scheduled.' : 'Reminder cancelled.');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  if (isLoading) return <LoadingState />;

  return (
    <AppScreen scroll>
      <View style={styles.header}>
        <AppText variant="title" weight="bold" color="accent">
          Reminders
        </AppText>
        <AppButton title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
      </View>

      {starter && (
        <AppText variant="caption" color="muted" style={styles.sub}>
          For {starter.name}
        </AppText>
      )}

      <AppCard style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowInfo}>
            <AppText variant="body" weight="semibold">
              Daily reminders
            </AppText>
            <AppText variant="caption" color="muted">
              Get notified when it's time to feed
            </AppText>
          </View>
          <Controller
            control={control}
            name="enabled"
            render={({ field: { onChange, value } }) => (
              <Switch
                value={value}
                onValueChange={onChange}
                trackColor={{ true: colors.rye, false: colors.creamBorder }}
                thumbColor={colors.white}
              />
            )}
          />
        </View>
      </AppCard>

      {enabled && (
        <View style={styles.timeSection}>
          <Controller
            control={control}
            name="reminder_time"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Reminder time (HH:MM)"
                placeholder="08:00"
                keyboardType="numbers-and-punctuation"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ?? ''}
                error={errors.reminder_time?.message}
                hint="Daily reminder will fire at this time"
              />
            )}
          />
        </View>
      )}

      <AppButton
        title="Save"
        onPress={handleSubmit(onSubmit)}
        loading={upsert.isPending}
        size="lg"
        style={styles.submit}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sub: {
    marginBottom: spacing.lg,
  },
  card: {
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  rowInfo: {
    flex: 1,
    gap: 2,
  },
  timeSection: {
    marginBottom: spacing.lg,
  },
  submit: {
    marginTop: spacing.sm,
  },
});
