import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from './AppText';
import { AppCard } from './AppCard';
import { spacing } from '@/constants/spacing';
import { colors } from '@/constants/colors';
import { differenceInDays, parseISO } from 'date-fns';

interface StarterGuidanceProps {
  starterName: string;
  startedAt: string;
  status: string;
  storageMode: string;
}

type GuidanceStage = 'day1' | 'early' | 'strengthening' | 'active' | 'fridge';

function getGuidanceStage(
  startedAt: string,
  status: string,
  storageMode: string,
): GuidanceStage {
  if (storageMode === 'fridge' || status === 'fridge') return 'fridge';
  if (status === 'active') return 'active';

  const days = differenceInDays(new Date(), parseISO(startedAt));
  if (days === 0) return 'day1';
  if (days < 5) return 'early';
  return 'strengthening';
}

const GUIDANCE: Record<
  GuidanceStage,
  { title: string; steps: string[]; note?: string }
> = {
  day1: {
    title: 'Day 1 — Getting started',
    steps: [
      '30g rye flour',
      '30g lukewarm water (around 25°C)',
      'Mix well in a clean jar',
      'Loosely cover (allow gas to escape)',
      'Leave at room temperature (ideally 24–26°C)',
    ],
    note: "Nothing may happen on day 1. That's completely normal.",
  },
  early: {
    title: 'Days 2–4 — Daily feeding',
    steps: [
      'Keep 30g of starter from yesterday',
      'Discard the rest',
      'Add 30g rye flour',
      'Add 30g water',
      'Stir well, loosely cover, leave at room temp',
    ],
    note: 'You may see some activity — small bubbles, a tangy smell. Keep going.',
  },
  strengthening: {
    title: 'Days 5–10 — Strengthening',
    steps: [
      'Continue daily feeding (30g kept, 30g flour, 30g water)',
      'Look for: rising activity, more bubbles, predictable peak',
      'Do a float test or observe doubling',
      "Don't switch to all-purpose flour yet",
    ],
    note: "Don't assume readiness based on days alone — look for the signs.",
  },
  active: {
    title: 'Active starter',
    steps: [
      'Feed every 24h at room temperature',
      'Use at peak (6–8h after feeding when domed and bubbly)',
      'Maintain your 30g kept : 30g flour : 30g water ratio',
      'Watch for consistent doubling and pleasant sour smell',
    ],
    note: 'Your starter is ready. Bake something great.',
  },
  fridge: {
    title: 'Fridge storage',
    steps: [
      'Feed before refrigerating',
      'Maintain once a week minimum',
      'Take out 12–24h before baking, feed, let it peak',
      'Check for grey liquid (hooch) — just stir it in',
    ],
    note: 'Cold slows fermentation — your starter is fine in the fridge for weeks.',
  },
};

export function StarterGuidance({
  starterName,
  startedAt,
  status,
  storageMode,
}: StarterGuidanceProps) {
  const [expanded, setExpanded] = useState(status === 'starting');
  const stage = getGuidanceStage(startedAt, status, storageMode);
  const guidance = GUIDANCE[stage];

  return (
    <AppCard style={styles.card}>
      <TouchableOpacity onPress={() => setExpanded((e) => !e)} style={styles.header}>
        <View style={styles.headerLeft}>
          <AppText style={styles.icon}>🌾</AppText>
          <AppText variant="body" weight="semibold" color="accent">
            {guidance.title}
          </AppText>
        </View>
        <AppText variant="body" color="muted">
          {expanded ? '▲' : '▼'}
        </AppText>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          <View style={styles.steps}>
            {guidance.steps.map((step, i) => (
              <View key={i} style={styles.step}>
                <AppText variant="caption" color="accent" weight="semibold" style={styles.stepNum}>
                  {i + 1}.
                </AppText>
                <AppText variant="caption" color="default">
                  {step}
                </AppText>
              </View>
            ))}
          </View>
          {guidance.note && (
            <View style={styles.note}>
              <AppText variant="caption" color="muted" style={styles.noteText}>
                💡 {guidance.note}
              </AppText>
            </View>
          )}
        </View>
      )}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.creamDark,
    borderColor: colors.wheatLight,
    gap: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  icon: {
    fontSize: 18,
  },
  content: {
    marginTop: spacing.md,
    gap: spacing.md,
  },
  steps: {
    gap: spacing.sm,
  },
  step: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  stepNum: {
    width: 18,
    flexShrink: 0,
  },
  note: {
    padding: spacing.sm,
    backgroundColor: colors.cream,
    borderRadius: 8,
  },
  noteText: {
    fontStyle: 'italic',
  },
});
