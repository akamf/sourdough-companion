import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/spacing';

interface AppCardProps extends ViewProps {
  elevated?: boolean;
}

export function AppCard({ children, elevated = true, style, ...props }: AppCardProps) {
  return (
    <View style={[styles.card, elevated && styles.elevated, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.creamBorder,
  },
  elevated: {
    shadowColor: colors.bark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
});
