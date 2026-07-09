import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppScreen } from '@/components/AppScreen';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { AppCard } from '@/components/AppCard';
import { useFeedStarter } from '@/hooks/useFeedingLogs';
import { useStarter } from '@/hooks/useStarters';
import { feedingLogSchema, type FeedingLogFormValues } from '@/lib/schemas/starter';
import { spacing } from '@/constants/spacing';
import { colors } from '@/constants/colors';

export default function FeedStarterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: starter } = useStarter(id ?? '');
  const feedMutation = useFeedStarter(id ?? '');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FeedingLogFormValues>({
    resolver: zodResolver(feedingLogSchema),
    defaultValues: {
      fed_at: new Date().toISOString(),
      starter_kept_g: 30,
      flour_g: 30,
      water_g: 30,
      flour_type: starter?.flour_base ?? '',
      notes: '',
    },
  });

  const onSubmit = async (values: FeedingLogFormValues) => {
    try {
      await feedMutation.mutateAsync(values);
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Could not log feeding.');
    }
  };

  const onQuickFeed = async () => {
    try {
      await feedMutation.mutateAsync({
        fed_at: new Date().toISOString(),
        starter_kept_g: 30,
        flour_g: 30,
        water_g: 30,
        flour_type: starter?.flour_base ?? '',
        notes: '',
      });
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Could not log feeding.');
    }
  };

  return (
    <AppScreen scroll>
      <View style={styles.header}>
        <View>
          <AppText variant="title" weight="bold" color="accent">
            Feed {starter?.name ?? 'starter'}
          </AppText>
          <AppText variant="caption" color="muted">
            Default ratio: {starter?.default_feed_ratio ?? '1:1:1'}
          </AppText>
        </View>
        <AppButton
          title="Cancel"
          variant="ghost"
          size="sm"
          onPress={() => router.back()}
        />
      </View>

      {/* Quick feed */}
      <AppCard style={styles.quickCard}>
        <AppText variant="body" weight="semibold">
          Quick feed
        </AppText>
        <AppText variant="caption" color="muted">
          30g kept · 30g flour · 30g water, right now
        </AppText>
        <AppButton
          title="Log feeding now"
          onPress={onQuickFeed}
          loading={feedMutation.isPending}
          size="md"
          style={styles.quickBtn}
        />
      </AppCard>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <AppText variant="caption" color="muted">
          or enter amounts
        </AppText>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.form}>
        <View style={styles.row}>
          <Controller
            control={control}
            name="starter_kept_g"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Kept (g)"
                placeholder="30"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value?.toString() ?? ''}
                error={errors.starter_kept_g?.message}
                style={styles.halfInput}
              />
            )}
          />
          <Controller
            control={control}
            name="flour_g"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Flour (g)"
                placeholder="30"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value?.toString() ?? ''}
                error={errors.flour_g?.message}
                style={styles.halfInput}
              />
            )}
          />
          <Controller
            control={control}
            name="water_g"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Water (g)"
                placeholder="30"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value?.toString() ?? ''}
                error={errors.water_g?.message}
                style={styles.halfInput}
              />
            )}
          />
        </View>

        <Controller
          control={control}
          name="flour_type"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Flour type"
              placeholder="e.g. Whole rye"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ?? ''}
              error={errors.flour_type?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Notes (optional)"
              placeholder="Activity, smell, texture..."
              multiline
              numberOfLines={3}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ?? ''}
              error={errors.notes?.message}
            />
          )}
        />

        <AppButton
          title="Save feeding"
          onPress={handleSubmit(onSubmit)}
          loading={feedMutation.isPending}
          size="lg"
          style={styles.submit}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  quickCard: {
    gap: spacing.sm,
    backgroundColor: colors.creamDark,
    borderColor: colors.creamBorder,
  },
  quickBtn: {
    alignSelf: 'flex-start',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.creamBorder,
  },
  form: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfInput: {
    flex: 1,
  },
  submit: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
});
