import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleStarterFeedReminder(
  starterId: string,
  starterName: string,
  reminderTime: { hour: number; minute: number },
): Promise<string> {
  await cancelStarterFeedReminder(starterId);

  const trigger: Notifications.DailyTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour: reminderTime.hour,
    minute: reminderTime.minute,
  };

  const id = await Notifications.scheduleNotificationAsync({
    identifier: `starter-feed-${starterId}`,
    content: {
      title: `Time to feed ${starterName}`,
      body: `${starterName} is waiting for its daily feeding.`,
      data: { starterId },
    },
    trigger,
  });

  return id;
}

export async function cancelStarterFeedReminder(starterId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(`starter-feed-${starterId}`);
}

export async function rescheduleStarterReminder(
  starterId: string,
  starterName: string,
  reminderTime: { hour: number; minute: number },
): Promise<string> {
  return scheduleStarterFeedReminder(starterId, starterName, reminderTime);
}

export function parseReminderTime(timeStr: string): { hour: number; minute: number } {
  const [hour, minute] = timeStr.split(':').map(Number);
  return { hour: hour ?? 8, minute: minute ?? 0 };
}
