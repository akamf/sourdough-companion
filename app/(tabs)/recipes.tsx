import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppScreen } from '@/components/AppScreen';
import { AppText } from '@/components/AppText';
import { EmptyState } from '@/components/EmptyState';
import { spacing } from '@/constants/spacing';

export default function RecipesScreen() {
  return (
    <AppScreen scroll>
      <View style={styles.header}>
        <AppText variant="title" weight="bold" color="accent">
          Recipes
        </AppText>
      </View>

      <EmptyState
        icon="📖"
        title="Your recipe board"
        message="Save the recipes that actually worked with your starter. Coming soon."
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
  },
});
