import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { AppScreen } from '@/components/AppScreen';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { SectionHeader } from '@/components/SectionHeader';
import { useRecipes } from '@/hooks/useRecipes';
import { spacing } from '@/constants/spacing';
import { colors } from '@/constants/colors';

const BASE_RYE_RECIPE = {
  id: 'base-rye',
  title: 'Base Rye Starter',
  flour_type: 'Rye',
  hydration_percent: 100,
  steps:
    'Day 1: Mix 30g rye flour + 30g lukewarm water in clean jar. Cover loosely. Leave at room temp.\n\nDay 2+: Keep 30g starter, discard the rest. Add 30g rye flour + 30g water. Mix, cover, repeat daily.\n\nReady when: bubbly, pleasant sour/yeasty smell, predictable doubling after each feeding.',
  grade: null as number | null,
  source_url: null as string | null,
  notes: 'The foundation. Use for your first starter and any time you want to restart.',
  visibility: 'public',
};

export default function RecipesScreen() {
  const router = useRouter();
  const { data: recipes, isLoading, refetch, isRefetching } = useRecipes();

  if (isLoading) return <LoadingState />;

  return (
    <AppScreen
      scroll
      scrollProps={{
        refreshControl: <RefreshControl refreshing={isRefetching} onRefresh={refetch} />,
      }}
    >
      <View style={styles.header}>
        <AppText variant="title" weight="bold" color="accent">
          Recipes
        </AppText>
        <AppButton
          title="+ Add"
          size="sm"
          onPress={() => router.push('/recipe/new')}
        />
      </View>

      {/* Base recipe — always shown */}
      <View style={styles.section}>
        <SectionHeader title="Foundation" />
        <RecipeCard recipe={BASE_RYE_RECIPE} isBase />
      </View>

      {/* User recipes */}
      <View style={styles.section}>
        <SectionHeader
          title="Your recipes"
          actionLabel="Add"
          onAction={() => router.push('/recipe/new')}
        />
        {!recipes?.length ? (
          <AppCard style={styles.emptyCard} elevated={false}>
            <AppText variant="body" color="muted" style={styles.emptyText}>
              Save the recipes that actually worked with your starter.
            </AppText>
          </AppCard>
        ) : (
          <View style={styles.list}>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </View>
        )}
      </View>
    </AppScreen>
  );
}

interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    flour_type?: string | null;
    hydration_percent?: number | null;
    steps?: string | null;
    grade?: number | null;
    source_url?: string | null;
    notes?: string | null;
  };
  isBase?: boolean;
}

function RecipeCard({ recipe, isBase }: RecipeCardProps) {
  const [expanded, setExpanded] = React.useState(isBase);

  return (
    <AppCard style={styles.recipeCard}>
      <TouchableOpacity onPress={() => setExpanded((e) => !e)} style={styles.recipeHeader}>
        <View style={styles.recipeTitle}>
          <AppText variant="body" weight="semibold">
            {recipe.title}
          </AppText>
          <View style={styles.recipeMeta}>
            {recipe.flour_type && (
              <AppText variant="micro" color="muted">
                {recipe.flour_type}
              </AppText>
            )}
            {recipe.hydration_percent && (
              <AppText variant="micro" color="muted">
                {recipe.hydration_percent}% hydration
              </AppText>
            )}
            {recipe.grade && (
              <AppText variant="micro">
                {'★'.repeat(recipe.grade)}{'☆'.repeat(5 - recipe.grade)}
              </AppText>
            )}
          </View>
        </View>
        <AppText variant="caption" color="muted">
          {expanded ? '▲' : '▼'}
        </AppText>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.recipeContent}>
          {recipe.notes && (
            <AppText variant="caption" color="muted" style={styles.recipeNotes}>
              {recipe.notes}
            </AppText>
          )}
          {recipe.steps && (
            <AppText variant="caption" style={styles.recipeSteps}>
              {recipe.steps}
            </AppText>
          )}
          {recipe.source_url && (
            <TouchableOpacity onPress={() => Linking.openURL(recipe.source_url!)}>
              <AppText variant="caption" color="accent" weight="medium">
                View original recipe →
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      )}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  section: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  list: {
    gap: spacing.sm,
  },
  emptyCard: {
    backgroundColor: colors.creamDark,
    borderColor: colors.creamBorder,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  recipeCard: {
    gap: spacing.sm,
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  recipeTitle: {
    flex: 1,
    gap: spacing.xs,
  },
  recipeMeta: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  recipeContent: {
    gap: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.creamBorder,
  },
  recipeNotes: {
    fontStyle: 'italic',
  },
  recipeSteps: {
    lineHeight: 22,
    color: colors.warmGrayDark,
  },
});
