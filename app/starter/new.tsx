import React from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { AppScreen } from '@/components/AppScreen';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { AppCard } from '@/components/AppCard';
import { SectionHeader } from '@/components/SectionHeader';
import {
  starterSchema,
  type StarterFormValues,
  FLOUR_BASES,
  STORAGE_MODES,
} from '@/lib/schemas/starter';
import { useCreateStarter } from '@/hooks/useStarters';
import { spacing } from '@/constants/spacing';
import { colors } from '@/constants/colors';
import { TouchableOpacity } from 'react-native';

export default function NewStarterScreen() {
  const router = useRouter();
  const createStarter = useCreateStarter();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StarterFormValues>({
    resolver: zodResolver(starterSchema),
    defaultValues: {
      name: '',
      flour_base: 'Rye',
      hydration_percent: 100,
      started_at: format(new Date(), 'yyyy-MM-dd'),
      status: 'starting',
      storage_mode: 'room_temp',
      default_feed_ratio: '1:1:1',
    },
  });

  const selectedFlour = watch('flour_base');
  const selectedStorage = watch('storage_mode');

  const onSubmit = async (values: StarterFormValues) => {
    try {
      const starter = await createStarter.mutateAsync(values);
      router.replace(`/starter/${starter.id}`);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Could not create starter.');
    }
  };

  return (
    <AppScreen scroll>
      <View style={styles.header}>
        <AppText variant="title" weight="bold" color="accent">
          New starter
        </AppText>
        <AppButton
          title="Cancel"
          variant="ghost"
          size="sm"
          onPress={() => router.back()}
        />
      </View>

      <View style={styles.form}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Name"
              placeholder="e.g. Hugo, Rye Beast, Levain"
              autoCapitalize="words"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.name?.message}
            />
          )}
        />

        <View style={styles.section}>
          <SectionHeader title="Flour base" />
          <View style={styles.chips}>
            {FLOUR_BASES.map((flour) => (
              <TouchableOpacity
                key={flour}
                onPress={() => setValue('flour_base', flour)}
                style={[
                  styles.chip,
                  selectedFlour === flour && styles.chipSelected,
                ]}
              >
                <AppText
                  variant="caption"
                  weight="medium"
                  style={selectedFlour === flour ? styles.chipTextSelected : styles.chipText}
                >
                  {flour}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
          {errors.flour_base && (
            <AppText variant="caption" color="danger">
              {errors.flour_base.message}
            </AppText>
          )}
        </View>

        <Controller
          control={control}
          name="hydration_percent"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Hydration %"
              placeholder="100"
              keyboardType="numeric"
              hint="Most starters are 100% hydration (equal parts flour and water by weight)"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value?.toString() ?? ''}
              error={errors.hydration_percent?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="started_at"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Date started"
              placeholder="YYYY-MM-DD"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.started_at?.message}
              hint="When did you mix the first batch?"
            />
          )}
        />

        <View style={styles.section}>
          <SectionHeader title="Storage" />
          <View style={styles.chips}>
            {(Object.entries(STORAGE_MODES) as [StarterFormValues['storage_mode'], string][]).map(
              ([key, label]) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => setValue('storage_mode', key)}
                  style={[
                    styles.chip,
                    selectedStorage === key && styles.chipSelected,
                  ]}
                >
                  <AppText
                    variant="caption"
                    weight="medium"
                    style={selectedStorage === key ? styles.chipTextSelected : styles.chipText}
                  >
                    {label}
                  </AppText>
                </TouchableOpacity>
              ),
            )}
          </View>
        </View>

        <Controller
          control={control}
          name="default_feed_ratio"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Default feed ratio"
              placeholder="1:1:1"
              hint="starter:flour:water"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.default_feed_ratio?.message}
            />
          )}
        />

        <AppCard style={styles.guidanceCard}>
          <AppText variant="caption" weight="semibold" color="accent">
            🌾 Starting tip
          </AppText>
          <AppText variant="caption" color="muted">
            A new starter needs daily feeding for 5–10 days before it's reliably active. Don't
            worry if it's sluggish at first — it just needs time.
          </AppText>
        </AppCard>

        <AppButton
          title="Create starter"
          onPress={handleSubmit(onSubmit)}
          loading={createStarter.isPending}
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
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  form: {
    gap: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: 20,
    backgroundColor: colors.creamDark,
    borderWidth: 1,
    borderColor: colors.creamBorder,
  },
  chipSelected: {
    backgroundColor: colors.rye,
    borderColor: colors.rye,
  },
  chipText: {
    color: colors.warmGrayDark,
  },
  chipTextSelected: {
    color: colors.white,
  },
  guidanceCard: {
    gap: spacing.sm,
    backgroundColor: colors.creamDark,
    borderColor: colors.wheatLight,
  },
  submit: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
});
