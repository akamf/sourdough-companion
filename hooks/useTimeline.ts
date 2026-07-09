import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { TimelineEventFormValues } from '@/lib/schemas/starter';
import type { Database } from '@/lib/types/database';

type FeedingLog = Database['public']['Tables']['feeding_logs']['Row'];
type TimelineEvent = Database['public']['Tables']['timeline_events']['Row'];
type ReadinessCheck = Database['public']['Tables']['starter_readiness_checks']['Row'];

export type TimelineItem =
  | { type: 'feeding'; occurredAt: string; id: string; data: FeedingLog }
  | { type: 'event'; occurredAt: string; id: string; data: TimelineEvent }
  | { type: 'readiness_check'; occurredAt: string; id: string; data: ReadinessCheck };

export const timelineKeys = {
  all: ['timeline'] as const,
  byStarter: (starterId: string) => [...timelineKeys.all, starterId] as const,
};

export function useUnifiedTimeline(starterId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: timelineKeys.byStarter(starterId),
    queryFn: async (): Promise<TimelineItem[]> => {
      const [feedings, events, checks] = await Promise.all([
        supabase
          .from('feeding_logs')
          .select('*')
          .eq('starter_id', starterId)
          .order('fed_at', { ascending: false }),
        supabase
          .from('timeline_events')
          .select('*')
          .eq('starter_id', starterId)
          .order('event_date', { ascending: false }),
        supabase
          .from('starter_readiness_checks')
          .select('*')
          .eq('starter_id', starterId)
          .order('checked_at', { ascending: false }),
      ]);

      if (feedings.error) throw feedings.error;
      if (events.error) throw events.error;
      if (checks.error) throw checks.error;

      const items: TimelineItem[] = [
        ...(feedings.data ?? []).map(
          (f): TimelineItem => ({ type: 'feeding', occurredAt: f.fed_at, id: f.id, data: f }),
        ),
        ...(events.data ?? []).map(
          (e): TimelineItem => ({
            type: 'event',
            occurredAt: e.event_date,
            id: e.id,
            data: e,
          }),
        ),
        ...(checks.data ?? []).map(
          (c): TimelineItem => ({
            type: 'readiness_check',
            occurredAt: c.checked_at,
            id: c.id,
            data: c,
          }),
        ),
      ];

      return items.sort(
        (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
      );
    },
    enabled: !!user && !!starterId,
  });
}

export function useCreateTimelineEvent(starterId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (values: TimelineEventFormValues) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('timeline_events')
        .insert({ ...values, starter_id: starterId, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data as TimelineEvent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timelineKeys.byStarter(starterId) });
    },
  });
}

export function useCreateReadinessCheck(starterId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (values: {
      has_bubbles: boolean;
      doubles_predictably: boolean;
      pleasant_smell: boolean;
      used_successfully: boolean;
      notes?: string | null;
    }) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('starter_readiness_checks')
        .insert({ ...values, starter_id: starterId, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data as ReadinessCheck;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timelineKeys.byStarter(starterId) });
    },
  });
}
