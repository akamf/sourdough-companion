import { differenceInHours, differenceInDays, startOfDay, isSameDay, subDays } from 'date-fns';
import type { Database } from '../types/database';

type FeedingLog = Database['public']['Tables']['feeding_logs']['Row'];

export function getLastFedAt(logs: FeedingLog[]): Date | null {
  if (!logs.length) return null;
  const sorted = [...logs].sort(
    (a, b) => new Date(b.fed_at).getTime() - new Date(a.fed_at).getTime(),
  );
  return new Date(sorted[0].fed_at);
}

export function getNextFeedAt(
  lastFedAt: Date | null,
  storageMode: string,
): Date | null {
  if (!lastFedAt) return null;
  const hoursUntilFeed = storageMode === 'fridge' ? 24 * 7 : 24;
  const next = new Date(lastFedAt);
  next.setHours(next.getHours() + hoursUntilFeed);
  return next;
}

export type FeedStatus = 'fed_today' | 'due_soon' | 'due_today' | 'overdue' | 'fridge' | 'unknown';

export function getFeedStatus(
  logs: FeedingLog[],
  storageMode: string,
): FeedStatus {
  if (storageMode === 'fridge') return 'fridge';

  const lastFed = getLastFedAt(logs);
  if (!lastFed) return 'unknown';

  const now = new Date();
  const hoursAgo = differenceInHours(now, lastFed);

  if (hoursAgo < 18) return 'fed_today';
  if (hoursAgo < 24) return 'due_soon';
  if (hoursAgo < 30) return 'due_today';
  return 'overdue';
}

export function getFeedStatusLabel(status: FeedStatus, starterName: string): string {
  switch (status) {
    case 'fed_today':
      return 'Fed today';
    case 'due_soon':
      return `${starterName} is getting hungry.`;
    case 'due_today':
      return `${starterName} is hungry.`;
    case 'overdue':
      return `${starterName} needs feeding.`;
    case 'fridge':
      return 'Resting in the fridge.';
    default:
      return 'No feedings logged yet.';
  }
}

export function getCurrentCareStreak(logs: FeedingLog[]): number {
  if (!logs.length) return 0;

  const sorted = [...logs].sort(
    (a, b) => new Date(b.fed_at).getTime() - new Date(a.fed_at).getTime(),
  );

  const today = startOfDay(new Date());
  let streak = 0;
  let checkDate = today;

  for (const log of sorted) {
    const fedDay = startOfDay(new Date(log.fed_at));
    if (isSameDay(fedDay, checkDate)) {
      streak++;
      checkDate = subDays(checkDate, 1);
    } else if (fedDay < checkDate) {
      break;
    }
  }

  return streak;
}

export function getLongestCareStreak(logs: FeedingLog[]): number {
  if (!logs.length) return 0;

  const sorted = [...logs].sort(
    (a, b) => new Date(a.fed_at).getTime() - new Date(b.fed_at).getTime(),
  );

  const uniqueDays = Array.from(
    new Set(sorted.map((l) => startOfDay(new Date(l.fed_at)).toISOString())),
  ).map((d) => new Date(d));

  let longest = 1;
  let current = 1;

  for (let i = 1; i < uniqueDays.length; i++) {
    const diff = differenceInDays(uniqueDays[i], uniqueDays[i - 1]);
    if (diff === 1) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }

  return longest;
}

export function formatLastFed(lastFedAt: Date | null): string {
  if (!lastFedAt) return 'Never fed';
  const hours = differenceInHours(new Date(), lastFedAt);
  if (hours < 1) return 'Fed just now';
  if (hours < 24) return `Fed ${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `Fed ${days}d ago`;
}
