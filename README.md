# Sourdough Companion

A warm, polished mobile app for tracking sourdough starters — built for bakers who care about their craft.

## Features

- **Multiple starters** — track as many starters as you like, each with its own name, flour base, hydration, and status
- **Unified timeline** — every feeding, bake, observation, readiness check, and custom event in one chronological feed
- **Feeding streaks** — care consistency tracking with friendly language ("Hugo is hungry", "🔥 8-day streak")
- **Feeding reminders** — local daily notifications per starter
- **Starter lifecycle** — from Day 1 guidance through establishing, active, and fridge modes
- **Readiness checks** — structured check-in to assess when a starter is genuinely ready to bake with
- **Recipe board** — save and rate your recipes, with a built-in base rye starter recipe
- **Secure auth** — email/password auth via Supabase with session persistence

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo 57 / React Native 0.86 |
| Routing | Expo Router 57 |
| Language | TypeScript 6 (strict) |
| Auth & DB | Supabase (Auth + Postgres + RLS) |
| Server state | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Notifications | Expo Notifications (local) |
| Secure storage | Expo SecureStore |
| Dates | date-fns v4 |

## Setup

### 1. Clone and install

```bash
git clone <repo>
cd sourdough-companion
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in your Supabase project URL and anon key:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the migration in the SQL editor:

```bash
# Copy and paste supabase/migrations/20240101000000_initial_schema.sql
# into your Supabase SQL editor and run it
```

This creates:
- `profiles` — auto-created on signup
- `starters` — sourdough starters per user
- `feeding_logs` — feeding history
- `timeline_events` — custom events, bakes, observations
- `starter_readiness_checks` — structured readiness assessments
- `recipes` — saved recipes
- `notification_settings` — per-starter reminder config

All tables have Row Level Security enabled — users can only access their own data.

### 4. Run the app

```bash
npm start
```

Then press `a` for Android, `i` for iOS, or `w` for web.

## Testing the main flows

### Auth
1. Open the app → you'll see the login screen
2. Tap "Create one" → fill in name, email, password
3. Check your email for a confirmation link
4. Sign in with your credentials

### Starter creation
1. Tap "Add starter" on the dashboard
2. Enter a name (e.g. "Hugo"), pick flour base (Rye), set start date
3. Tap "Create starter" → redirects to starter detail
4. Guidance card appears based on starter age

### Feeding
1. On starter detail, tap "Feed"
2. Tap "Log feeding now" for a quick 30:30:30 feed
3. Or fill in custom amounts and notes
4. Returns to starter detail — timeline updates

### Unified timeline
- All feedings, events, and readiness checks appear in the timeline
- Grouped by date, with icons per event type

### Custom events
1. On starter detail, tap "Add event"
2. Pick event type (Bake, Observation, etc.)
3. Fill in title, notes, optional rating and recipe URL
4. Event appears in timeline

### Readiness check
1. On starter detail (only shown when status is 'starting'), tap "Check readiness"
2. Toggle what you observe
3. If 3/4 signs confirmed, starter status updates to "active"

### Notifications
1. Tap the 🔔 button on starter detail
2. Enable reminders and set a time
3. Local notification will fire daily at that time

### Recipes
1. Tap the Recipes tab
2. Built-in Base Rye Starter recipe is always shown
3. Tap "+ Add" to save your own recipes with rating, steps, and source URL

## Project structure

```
app/
  (auth)/       # login, signup
  (tabs)/       # dashboard, starters, recipes, settings
  starter/[id]/ # detail, feed, event, readiness, notifications
  recipe/       # new recipe
components/
  timeline/     # unified timeline components
  AppText, AppButton, AppCard, AppInput, AppScreen, ...
hooks/
  useStarters, useFeedingLogs, useTimeline, useRecipes, ...
lib/
  supabase.ts
  schemas/      # Zod schemas
  types/        # Database types
  utils/        # streak calculations
  notifications/
constants/
  colors.ts, spacing.ts
supabase/
  migrations/   # SQL schema
```

## Future roadmap

- Recipe sharing and public recipe board
- Starter photos (bake results, crumb shots)
- Bake planner (schedule upcoming bakes around feeding schedule)
- Smart feeding suggestions based on starter activity patterns
- Fridge schedule mode (weekly feeds, alerts)
- Starter health insights (trend analysis, peak detection)
- Community recipes and public starter profiles
- Export starter timeline as PDF
- Starter sharing / gifting flow
