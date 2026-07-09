import { z } from 'zod';

export const starterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  flour_base: z.string().min(1, 'Flour base is required'),
  hydration_percent: z.coerce
    .number()
    .int()
    .min(50, 'Minimum 50%')
    .max(200, 'Maximum 200%')
    .default(100),
  started_at: z.string().min(1, 'Start date is required'),
  status: z
    .enum(['starting', 'establishing', 'active', 'fridge', 'dormant'])
    .default('starting'),
  storage_mode: z.enum(['room_temp', 'fridge']).default('room_temp'),
  default_feed_ratio: z.string().default('1:1:1'),
  default_feed_time: z.string().nullable().optional(),
});

export type StarterFormValues = z.infer<typeof starterSchema>;

export const feedingLogSchema = z.object({
  fed_at: z.string().default(() => new Date().toISOString()),
  starter_kept_g: z.coerce.number().positive().nullable().optional(),
  flour_g: z.coerce.number().positive().nullable().optional(),
  water_g: z.coerce.number().positive().nullable().optional(),
  flour_type: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type FeedingLogFormValues = z.infer<typeof feedingLogSchema>;

export const readinessCheckSchema = z.object({
  checked_at: z.string().default(() => new Date().toISOString()),
  has_bubbles: z.boolean().default(false),
  doubles_predictably: z.boolean().default(false),
  pleasant_smell: z.boolean().default(false),
  used_successfully: z.boolean().default(false),
  notes: z.string().nullable().optional(),
});

export type ReadinessCheckFormValues = z.infer<typeof readinessCheckSchema>;

export const timelineEventSchema = z.object({
  event_type: z.enum([
    'created',
    'feeding',
    'bake',
    'discard',
    'observation',
    'fridge_rest',
    'revive',
    'problem',
    'recipe_test',
    'readiness_check',
    'status_change',
    'custom',
  ]),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  event_date: z.string().default(() => new Date().toISOString()),
  recipe_id: z.string().uuid().nullable().optional(),
  recipe_url: z.string().url('Enter a valid URL').nullable().optional().or(z.literal('')),
  comment: z.string().nullable().optional(),
  rating: z.coerce.number().int().min(1).max(5).nullable().optional(),
});

export type TimelineEventFormValues = z.infer<typeof timelineEventSchema>;

export const FLOUR_BASES = [
  'Rye',
  'Whole Wheat',
  'All-Purpose',
  'Bread Flour',
  'Einkorn',
  'Spelt',
  'Mixed',
] as const;

export const STARTER_STATUSES = {
  starting: 'Starting',
  establishing: 'Establishing',
  active: 'Active',
  fridge: 'In fridge',
  dormant: 'Dormant',
} as const;

export const STORAGE_MODES = {
  room_temp: 'Room temperature',
  fridge: 'Refrigerated',
} as const;

export const EVENT_TYPES = {
  created: 'Created',
  feeding: 'Feeding',
  bake: 'Bake',
  discard: 'Discard',
  observation: 'Observation',
  fridge_rest: 'Fridge rest',
  revive: 'Revival',
  problem: 'Problem',
  recipe_test: 'Recipe test',
  readiness_check: 'Readiness check',
  status_change: 'Status change',
  custom: 'Custom',
} as const;
