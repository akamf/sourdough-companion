import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewProps,
  ScrollViewProps,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

interface AppScreenProps extends ViewProps {
  scroll?: boolean;
  padded?: boolean;
  scrollProps?: ScrollViewProps;
}

export function AppScreen({
  children,
  scroll = false,
  padded = true,
  scrollProps,
  style,
  ...props
}: AppScreenProps) {
  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, padded && styles.padded]}
      showsVerticalScrollIndicator={false}
      {...scrollProps}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.inner, padded && styles.padded, style]} {...props}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.cream} />
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  inner: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  scrollContent: {
    backgroundColor: colors.cream,
    flexGrow: 1,
  },
  padded: {
    padding: spacing.md,
  },
});
