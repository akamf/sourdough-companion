import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { FeedingLogFormValues } from '@/lib/schemas/starter';
import type { Database } from '@/lib/types/database';
import { starterKeys } from './useStarters';
import { timelineKeys } from './useTimeline';

type FeedingLog = Database['public']['Tables']['feeding_logs']['Row'];

export const feedingKeys = {
  all: ['feeding_logs'] as const,
  byStarter: (starterId: string) => [...feedingKeys.all, starterId] as const,
};

export function useFeedingLogs(starterId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: feedingKeys.byStarter(starterId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feeding_logs')
        .select('*')
        .eq('starter_id', starterId)
        .order('fed_at', { ascending: false });
      if (error) throw error;
      return data as FeedingLog[];
    },
    enabled: !!user && !!starterId,
  });
}

export function useFeedStarter(starterId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (values: FeedingLogFormValues) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('feeding_logs')
        .insert({ ...values, starter_id: starterId, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data as FeedingLog;
    },
    onSuccess: async (log) => {
      await supabase
        .from('starters')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', starterId);

      queryClient.invalidateQueries({ queryKey: feedingKeys.byStarter(starterId) });
      queryClient.invalidateQueries({ queryKey: starterKeys.detail(starterId) });
      queryClient.invalidateQueries({ queryKey: starterKeys.list() });
      queryClient.invalidateQueries({ queryKey: timelineKeys.byStarter(starterId) });
    },
  });
}
