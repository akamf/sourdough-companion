import React from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppScreen } from '@/components/AppScreen';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { SectionHeader } from '@/components/SectionHeader';
import { useCreateRecipe, recipeSchema, type RecipeFormValues } from '@/hooks/useRecipes';
import { spacing } from '@/constants/spacing';
import { colors } from '@/constants/colors';

export default function NewRecipeScreen() {
  const router = useRouter();
  const create = useCreateRecipe();

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: '',
      source_url: '',
      steps: '',
      flour_type: '',
      hydration_percent: undefined,
      grade: undefined,
      notes: '',
      visibility: 'private',
    },
  });

  const grade = watch('grade');

  const onSubmit = async (values: RecipeFormValues) => {
    try {
      const recipe = await create.mutateAsync(values);
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Could not save recipe.');
    }
  };

  return (
    <AppScreen scroll>
      <View style={styles.header}>
        <AppText variant="title" weight="bold" color="accent">
          New recipe
        </AppText>
        <AppButton title="Cancel" variant="ghost" size="sm" onPress={() => router.back()} />
      </View>

      <View style={styles.form}>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Recipe name"
              placeholder="e.g. Country sourdough"
              autoCapitalize="words"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.title?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="source_url"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Source URL (optional)"
              placeholder="https://..."
              keyboardType="url"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ?? ''}
              error={errors.source_url?.message}
            />
          )}
        />

        <View style={styles.row}>
          <Controller
            control={control}
            name="flour_type"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Flour type"
                placeholder="Bread flour"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ?? ''}
                style={styles.halfInput}
              />
            )}
          />
          <Controller
            control={control}
            name="hydration_percent"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Hydration %"
                placeholder="75"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value?.toString() ?? ''}
                error={errors.hydration_percent?.message}
                style={styles.halfInput}
              />
            )}
          />
        </View>

        <Controller
          control={control}
          name="steps"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Recipe / steps"
              placeholder="Describe ingredients, process, timing..."
              multiline
              numberOfLines={6}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ?? ''}
            />
          )}
        />

        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Notes (optional)"
              placeholder="What worked, what to change..."
              multiline
              numberOfLines={3}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ?? ''}
            />
          )}
        />

        <View style={styles.section}>
          <SectionHeader title="Rating (optional)" />
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity
                key={n}
                onPress={() => setValue('grade', grade === n ? undefined : n)}
                hitSlop={8}
              >
                <AppText style={[styles.star, !!grade && n <= grade && styles.starFilled]}>
                  {grade && n <= grade ? '★' : '☆'}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <AppButton
          title="Save recipe"
          onPress={handleSubmit(onSubmit)}
          loading={create.isPending}
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
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfInput: {
    flex: 1,
  },
  section: {
    gap: spacing.sm,
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
