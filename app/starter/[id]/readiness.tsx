import React from 'react';
import { View, StyleSheet, Switch, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppScreen } from '@/components/AppScreen';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppInput } from '@/components/AppInput';
import { useCreateReadinessCheck } from '@/hooks/useTimeline';
import { useUpdateStarter, useStarter } from '@/hooks/useStarters';
import { readinessCheckSchema, type ReadinessCheckFormValues } from '@/lib/schemas/starter';
import { spacing } from '@/constants/spacing';
import { colors } from '@/constants/colors';

const CHECKS = [
  {
    key: 'has_bubbles' as const,
    label: 'Active bubbles',
    description: 'Lots of bubbles visible through the jar',
  },
  {
    key: 'doubles_predictably' as const,
    label: 'Doubles reliably',
    description: 'Doubles in volume 4–8 hours after feeding',
  },
  {
    key: 'pleasant_smell' as const,
    label: 'Pleasant smell',
    description: 'Sour, yeasty, mildly fruity — not sharp or cheesy',
  },
  {
    key: 'used_successfully' as const,
    label: 'Used in a bake',
    description: 'Contributed to a successful bread or bake',
  },
];

export default function ReadinessCheckScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: starter } = useStarter(id ?? '');
  const createCheck = useCreateReadinessCheck(id ?? '');
  const updateStarter = useUpdateStarter(id ?? '');

  const { control, handleSubmit, watch, formState: { errors } } = useForm<ReadinessCheckFormValues>({
    resolver: zodResolver(readinessCheckSchema),
    defaultValues: {
      has_bubbles: false,
      doubles_predictably: false,
      pleasant_smell: false,
      used_successfully: false,
      notes: '',
    },
  });

  const values = watch();
  const passedCount = CHECKS.filter((c) => values[c.key]).length;
  const isReady = passedCount >= 3;

  const onSubmit = async (formValues: ReadinessCheckFormValues) => {
    try {
      await createCheck.mutateAsync(formValues);

      if (isReady && starter?.status === 'starting') {
        await updateStarter.mutateAsync({ status: 'active' });
      }

      Alert.alert(
        isReady ? 'Looking ready! 🎉' : 'Keep going',
        isReady
          ? 'Your starter shows strong signs of readiness. You can try using it in a bake!'
          : `${passedCount}/4 signs confirmed. Give it a few more days.`,
        [{ text: 'Got it', onPress: () => router.back() }],
      );
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <AppScreen scroll>
      <View style={styles.header}>
        <AppText variant="title" weight="bold" color="accent">
          Readiness check
        </AppText>
        <AppButton title="Cancel" variant="ghost" size="sm" onPress={() => router.back()} />
      </View>

      {starter && (
        <AppText variant="caption" color="muted" style={styles.sub}>
          For {starter.name}
        </AppText>
      )}

      <AppText variant="body" color="muted" style={styles.intro}>
        Don't rush it — readiness is more reliable than a fixed number of days. Check off what you
        actually observe:
      </AppText>

      <View style={styles.checks}>
        {CHECKS.map((check) => (
          <AppCard key={check.key} style={styles.checkCard}>
            <View style={styles.checkRow}>
              <View style={styles.checkInfo}>
                <AppText variant="body" weight="semibold">
                  {check.label}
                </AppText>
                <AppText variant="caption" color="muted">
                  {check.description}
                </AppText>
              </View>
              <Controller
                control={control}
                name={check.key}
                render={({ field: { onChange, value } }) => (
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{ true: colors.green, false: colors.creamBorder }}
                    thumbColor={colors.white}
                  />
                )}
              />
            </View>
          </AppCard>
        ))}
      </View>

      <AppCard
        style={[
          styles.resultCard,
          { backgroundColor: isReady ? colors.greenLight : colors.creamDark },
        ]}
        elevated={false}
      >
        <AppText variant="body" weight="semibold" color={isReady ? 'success' : 'muted'}>
          {passedCount}/4 signs confirmed
        </AppText>
        <AppText variant="caption" color={isReady ? 'success' : 'muted'}>
          {isReady ? 'Your starter looks ready to bake with!' : 'Keep feeding daily and check again in a day or two.'}
        </AppText>
      </AppCard>

      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label="Observations (optional)"
            placeholder="What did you notice today?"
            multiline
            numberOfLines={3}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value ?? ''}
            style={styles.notes}
          />
        )}
      />

      <AppButton
        title="Save check"
        onPress={handleSubmit(onSubmit)}
        loading={createCheck.isPending || updateStarter.isPending}
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
  intro: {
    marginBottom: spacing.lg,
  },
  checks: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  checkCard: {
    padding: spacing.md,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  checkInfo: {
    flex: 1,
    gap: 2,
  },
  resultCard: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
    borderColor: 'transparent',
  },
  notes: {
    marginBottom: spacing.lg,
  },
  submit: {
    marginBottom: spacing.xl,
  },
});
