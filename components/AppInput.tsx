import React, { forwardRef } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors } from '@/constants/colors';
import { spacing, radius, fontSize } from '@/constants/spacing';
import { AppText } from './AppText';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  rightElement?: React.ReactNode;
}

export const AppInput = forwardRef<TextInput, AppInputProps>(function AppInput(
  { label, error, hint, rightElement, style, ...props },
  ref,
) {
  return (
    <View style={styles.container}>
      {label && (
        <AppText variant="caption" weight="medium" style={styles.label}>
          {label}
        </AppText>
      )}
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        <TextInput
          ref={ref}
          style={[styles.input, style]}
          placeholderTextColor={colors.warmGrayLight}
          {...props}
        />
        {rightElement && <View style={styles.right}>{rightElement}</View>}
      </View>
      {error && (
        <AppText variant="caption" color="danger" style={styles.error}>
          {error}
        </AppText>
      )}
      {hint && !error && (
        <AppText variant="caption" color="muted" style={styles.hint}>
          {hint}
        </AppText>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    color: colors.warmGrayDark,
    marginBottom: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamBorder,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  inputError: {
    borderColor: colors.red,
  },
  input: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.bark,
    paddingVertical: spacing.sm,
  },
  right: {
    marginLeft: spacing.sm,
  },
  error: {
    color: colors.red,
  },
  hint: {},
});
