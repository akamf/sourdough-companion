import React from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppScreen } from '@/components/AppScreen';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { SectionHeader } from '@/components/SectionHeader';
import { useCreateTimelineEvent } from '@/hooks/useTimeline';
import { useStarter } from '@/hooks/useStarters';
import { timelineEventSchema, type TimelineEventFormValues, EVENT_TYPES } from '@/lib/schemas/starter';
import { spacing } from '@/constants/spacing';
import { colors } from '@/constants/colors';

const EVENT_TYPE_LIST = (
  Object.entries(EVENT_TYPES) as [TimelineEventFormValues['event_type'], string][]
).filter(([k]) => k !== 'created' && k !== 'status_change');

export default function AddEventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: starter } = useStarter(id ?? '');
  const createEvent = useCreateTimelineEvent(id ?? '');

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TimelineEventFormValues>({
    resolver: zodResolver(timelineEventSchema),
    defaultValues: {
      event_type: 'observation',
      title: '',
      event_date: new Date().toISOString(),
      comment: '',
      rating: undefined,
      recipe_url: '',
    },
  });

  const selectedType = watch('event_type');

  const onSubmit = async (values: TimelineEventFormValues) => {
    try {
      await createEvent.mutateAsync({
        ...values,
        recipe_url: values.recipe_url || null,
        rating: values.rating ?? null,
      });
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Could not save event.');
    }
  };

  const showRecipe = selectedType === 'bake' || selectedType === 'recipe_test';
  const showRating = selectedType === 'bake' || selectedType === 'recipe_test' || selectedType === 'observation';

  return (
    <AppScreen scroll>
      <View style={styles.header}>
        <AppText variant="title" weight="bold" color="accent">
          Add event
        </AppText>
        <AppButton
          title="Cancel"
          variant="ghost"
          size="sm"
          onPress={() => router.back()}
        />
      </View>

      {starter && (
        <AppText variant="caption" color="muted" style={styles.starterName}>
          For {starter.name}
        </AppText>
      )}

      <View style={styles.form}>
        {/* Event type */}
        <View style={styles.section}>
          <SectionHeader title="Event type" />
          <View style={styles.chips}>
            {EVENT_TYPE_LIST.map(([key, label]) => (
              <TouchableOpacity
                key={key}
                onPress={() => setValue('event_type', key)}
                style={[
                  styles.chip,
                  selectedType === key && styles.chipSelected,
                ]}
              >
                <AppText
                  variant="caption"
                  weight="medium"
                  style={selectedType === key ? styles.chipTextSelected : styles.chipText}
                >
                  {label}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Title"
              placeholder="e.g. First bake, Really active today..."
              autoCapitalize="sentences"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.title?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="comment"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Notes (optional)"
              placeholder="Crumb, crust, activity level..."
              multiline
              numberOfLines={3}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ?? ''}
            />
          )}
        />

        {showRecipe && (
          <Controller
            control={control}
            name="recipe_url"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Recipe URL (optional)"
                placeholder="https://..."
                keyboardType="url"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ?? ''}
                error={errors.recipe_url?.message}
              />
            )}
          />
        )}

        {showRating && (
          <View style={styles.section}>
            <SectionHeader title="Rating (optional)" />
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity
                  key={n}
                  onPress={() => setValue('rating', n)}
                  hitSlop={8}
                >
                  <AppText style={[styles.star, !!watch('rating') && n <= (watch('rating') ?? 0) && styles.starFilled]}>
                    {n <= (watch('rating') ?? 0) ? '★' : '☆'}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <AppButton
          title="Save event"
          onPress={handleSubmit(onSubmit)}
          loading={createEvent.isPending}
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
    marginBottom: spacing.sm,
  },
  starterName: {
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
  stars: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  star: {
    fontSize: 28,
    color: colors.warmGrayLight,
  },
  starFilled: {
    color: colors.wheat,
  },
  submit: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
});
