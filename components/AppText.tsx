import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/spacing';

type Variant = 'display' | 'title' | 'heading' | 'subheading' | 'body' | 'caption' | 'micro';
type Weight = 'regular' | 'medium' | 'semibold' | 'bold';
type Color = 'default' | 'muted' | 'accent' | 'inverse' | 'danger' | 'success';

interface AppTextProps extends TextProps {
  variant?: Variant;
  weight?: Weight;
  color?: Color;
}

export function AppText({
  variant = 'body',
  weight,
  color = 'default',
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      style={[
        styles.base,
        styles[variant],
        weight ? styles[weight] : styles[defaultWeightForVariant(variant)],
        colorStyles[color],
        style,
      ]}
      {...props}
    />
  );
}

function defaultWeightForVariant(variant: Variant): Weight {
  switch (variant) {
    case 'display':
    case 'title':
      return 'bold';
    case 'heading':
    case 'subheading':
      return 'semibold';
    default:
      return 'regular';
  }
}

const styles = StyleSheet.create({
  base: {
    fontFamily: undefined,
  },
  display: { fontSize: fontSize.xxl, lineHeight: 38 },
  title: { fontSize: fontSize.xxl, lineHeight: 36 },
  heading: { fontSize: fontSize.xl, lineHeight: 30 },
  subheading: { fontSize: fontSize.lg, lineHeight: 26 },
  body: { fontSize: fontSize.base, lineHeight: 22 },
  caption: { fontSize: fontSize.sm, lineHeight: 18 },
  micro: { fontSize: fontSize.xs, lineHeight: 16 },
  regular: { fontWeight: fontWeight.regular },
  medium: { fontWeight: fontWeight.medium },
  semibold: { fontWeight: fontWeight.semibold },
  bold: { fontWeight: fontWeight.bold },
});

const colorStyles = StyleSheet.create({
  default: { color: colors.bark },
  muted: { color: colors.warmGray },
  accent: { color: colors.rye },
  inverse: { color: colors.white },
  danger: { color: colors.red },
  success: { color: colors.green },
});
