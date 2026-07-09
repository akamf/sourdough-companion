import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import {
  scheduleStarterFeedReminder,
  cancelStarterFeedReminder,
  requestNotificationPermissions,
  parseReminderTime,
} from '@/lib/notifications';
import type { Database } from '@/lib/types/database';

type NotificationSettings = Database['public']['Tables']['notification_settings']['Row'];

export const notifKeys = {
  byStarter: (starterId: string) => ['notification_settings', starterId] as const,
};

export function useNotificationSettings(starterId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: notifKeys.byStarter(starterId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('starter_id', starterId)
        .maybeSingle();
      if (error) throw error;
      return data as NotificationSettings | null;
    },
    enabled: !!user && !!starterId,
  });
}

export function useUpsertNotificationSettings(starterId: string, starterName: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (values: {
      enabled: boolean;
      reminder_time: string | null;
      timezone?: string | null;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data: existing } = await supabase
        .from('notification_settings')
        .select('id')
        .eq('starter_id', starterId)
        .maybeSingle();

      let result;
      if (existing?.id) {
        const { data, error } = await supabase
          .from('notification_settings')
          .update({ ...values, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('notification_settings')
          .insert({ ...values, starter_id: starterId, user_id: user.id })
          .select()
          .single();
        if (error) throw error;
        result = data;
      }

      if (values.enabled && values.reminder_time) {
        const granted = await requestNotificationPermissions();
        if (granted) {
          const time = parseReminderTime(values.reminder_time);
          await scheduleStarterFeedReminder(starterId, starterName, time);
        }
      } else {
        await cancelStarterFeedReminder(starterId);
      }

      return result as NotificationSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notifKeys.byStarter(starterId) });
    },
  });
}
