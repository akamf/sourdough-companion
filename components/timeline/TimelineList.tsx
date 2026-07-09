import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { startOfDay, isSameDay } from 'date-fns';
import type { TimelineItem } from '@/hooks/useTimeline';
import { FeedingTimelineItem } from './FeedingTimelineItem';
import { EventTimelineItem } from './EventTimelineItem';
import { ReadinessTimelineItem } from './ReadinessTimelineItem';
import { TimelineDateGroup } from './TimelineDateGroup';

interface TimelineListProps {
  items: TimelineItem[];
  filter?: string;
}

export function TimelineList({ items, filter }: TimelineListProps) {
  const filtered = useMemo(() => {
    if (!filter || filter === 'all') return items;
    switch (filter) {
      case 'feedings':
        return items.filter((i) => i.type === 'feeding');
      case 'bakes':
        return items.filter(
          (i) => i.type === 'event' && i.data.event_type === 'bake',
        );
      case 'observations':
        return items.filter(
          (i) =>
            i.type === 'event' &&
            (i.data.event_type === 'observation' || i.data.event_type === 'custom'),
        );
      case 'problems':
        return items.filter(
          (i) => i.type === 'event' && i.data.event_type === 'problem',
        );
      case 'readiness':
        return items.filter((i) => i.type === 'readiness_check');
      default:
        return items;
    }
  }, [items, filter]);

  const grouped = useMemo(() => {
    const groups: { date: Date; items: TimelineItem[] }[] = [];
    for (const item of filtered) {
      const itemDay = startOfDay(new Date(item.occurredAt));
      const last = groups[groups.length - 1];
      if (last && isSameDay(last.date, itemDay)) {
        last.items.push(item);
      } else {
        groups.push({ date: itemDay, items: [item] });
      }
    }
    return groups;
  }, [filtered]);

  return (
    <View>
      {grouped.map((group, gi) => (
        <View key={group.date.toISOString()}>
          <TimelineDateGroup date={group.date} />
          {group.items.map((item, idx) => {
            const isLast = gi === grouped.length - 1 && idx === group.items.length - 1;
            if (item.type === 'feeding') {
              return (
                <FeedingTimelineItem key={item.id} data={item.data} />
              );
            }
            if (item.type === 'readiness_check') {
              return (
                <ReadinessTimelineItem key={item.id} data={item.data} isLast={isLast} />
              );
            }
            return (
              <EventTimelineItem key={item.id} data={item.data} isLast={isLast} />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({});
