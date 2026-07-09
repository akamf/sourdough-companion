import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { StarterFormValues } from '@/lib/schemas/starter';
import type { Database } from '@/lib/types/database';

type Starter = Database['public']['Tables']['starters']['Row'];

export const starterKeys = {
  all: ['starters'] as const,
  list: () => [...starterKeys.all, 'list'] as const,
  detail: (id: string) => [...starterKeys.all, 'detail', id] as const,
};

export function useStarters() {
  const { user } = useAuth();

  return useQuery({
    queryKey: starterKeys.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('starters')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Starter[];
    },
    enabled: !!user,
  });
}

export function useStarter(id: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: starterKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('starters')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Starter;
    },
    enabled: !!user && !!id,
  });
}

export function useCreateStarter() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (values: StarterFormValues) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('starters')
        .insert({ ...values, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data as Starter;
    },
    onSuccess: async (starter) => {
      await queryClient.invalidateQueries({ queryKey: starterKeys.list() });
      await supabase.from('timeline_events').insert({
        starter_id: starter.id,
        user_id: starter.user_id,
        event_type: 'created',
        title: 'Starter created',
        comment: `${starter.flour_base} starter, ${starter.hydration_percent}% hydration. ${starter.default_feed_ratio} feed ratio.`,
        event_date: new Date().toISOString(),
      });
    },
  });
}

export function useUpdateStarter(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Partial<StarterFormValues>) => {
      const { data, error } = await supabase
        .from('starters')
        .update({ ...values, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Starter;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: starterKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: starterKeys.list() });
    },
  });
}
