import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import {
  getLastFedAt,
  getFeedStatus,
  getCurrentCareStreak,
  getLongestCareStreak,
  type FeedStatus,
} from '@/lib/utils/streak';
import type { Database } from '@/lib/types/database';

type Starter = Database['public']['Tables']['starters']['Row'];
type FeedingLog = Database['public']['Tables']['feeding_logs']['Row'];

export interface StarterWithStats {
  starter: Starter;
  logs: FeedingLog[];
  lastFedAt: Date | null;
  feedStatus: FeedStatus;
  careStreak: number;
  longestStreak: number;
}

export function useStartersWithStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['starters_with_stats'],
    queryFn: async (): Promise<StarterWithStats[]> => {
      const { data: starters, error: sErr } = await supabase
        .from('starters')
        .select('*')
        .order('created_at', { ascending: false });
      if (sErr) throw sErr;

      const { data: logs, error: lErr } = await supabase
        .from('feeding_logs')
        .select('*')
        .in(
          'starter_id',
          (starters ?? []).map((s) => s.id),
        )
        .order('fed_at', { ascending: false });
      if (lErr) throw lErr;

      return (starters ?? []).map((starter) => {
        const starterLogs = (logs ?? []).filter((l) => l.starter_id === starter.id);
        const lastFedAt = getLastFedAt(starterLogs);
        const feedStatus = getFeedStatus(starterLogs, starter.storage_mode);
        const careStreak = getCurrentCareStreak(starterLogs);
        const longestStreak = getLongestCareStreak(starterLogs);

        return { starter, logs: starterLogs, lastFedAt, feedStatus, careStreak, longestStreak };
      });
    },
    enabled: !!user,
  });
}
