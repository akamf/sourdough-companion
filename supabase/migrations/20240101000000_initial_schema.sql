-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── profiles ───────────────────────────────────────────────────────────────
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at  timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'display_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── starters ───────────────────────────────────────────────────────────────
create table starters (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references profiles(id) on delete cascade,
  name               text not null,
  flour_base         text not null,
  hydration_percent  int not null default 100,
  started_at         date not null,
  status             text not null default 'starting',
  storage_mode       text not null default 'room_temp',
  default_feed_ratio text not null default '1:1:1',
  default_feed_time  time,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

alter table starters enable row level security;

create policy "Users can read own starters"
  on starters for select using (auth.uid() = user_id);

create policy "Users can insert own starters"
  on starters for insert with check (auth.uid() = user_id);

create policy "Users can update own starters"
  on starters for update using (auth.uid() = user_id);

create policy "Users can delete own starters"
  on starters for delete using (auth.uid() = user_id);

-- ─── feeding_logs ────────────────────────────────────────────────────────────
create table feeding_logs (
  id              uuid primary key default gen_random_uuid(),
  starter_id      uuid not null references starters(id) on delete cascade,
  user_id         uuid not null references profiles(id) on delete cascade,
  fed_at          timestamptz not null default now(),
  starter_kept_g  numeric,
  flour_g         numeric,
  water_g         numeric,
  flour_type      text,
  notes           text,
  created_at      timestamptz not null default now()
);

alter table feeding_logs enable row level security;

create policy "Users can read own feeding logs"
  on feeding_logs for select using (auth.uid() = user_id);

create policy "Users can insert own feeding logs"
  on feeding_logs for insert with check (auth.uid() = user_id);

create policy "Users can update own feeding logs"
  on feeding_logs for update using (auth.uid() = user_id);

create policy "Users can delete own feeding logs"
  on feeding_logs for delete using (auth.uid() = user_id);

-- ─── timeline_events ─────────────────────────────────────────────────────────
create table timeline_events (
  id          uuid primary key default gen_random_uuid(),
  starter_id  uuid not null references starters(id) on delete cascade,
  user_id     uuid not null references profiles(id) on delete cascade,
  event_type  text not null,
  title       text not null,
  event_date  timestamptz not null default now(),
  recipe_id   uuid,
  recipe_url  text,
  comment     text,
  rating      int check (rating between 1 and 5),
  created_at  timestamptz not null default now()
);

alter table timeline_events enable row level security;

create policy "Users can read own timeline events"
  on timeline_events for select using (auth.uid() = user_id);

create policy "Users can insert own timeline events"
  on timeline_events for insert with check (auth.uid() = user_id);

create policy "Users can update own timeline events"
  on timeline_events for update using (auth.uid() = user_id);

create policy "Users can delete own timeline events"
  on timeline_events for delete using (auth.uid() = user_id);

-- ─── starter_readiness_checks ────────────────────────────────────────────────
create table starter_readiness_checks (
  id                   uuid primary key default gen_random_uuid(),
  starter_id           uuid not null references starters(id) on delete cascade,
  user_id              uuid not null references profiles(id) on delete cascade,
  checked_at           timestamptz not null default now(),
  has_bubbles          boolean not null default false,
  doubles_predictably  boolean not null default false,
  pleasant_smell       boolean not null default false,
  used_successfully    boolean not null default false,
  notes                text,
  created_at           timestamptz not null default now()
);

alter table starter_readiness_checks enable row level security;

create policy "Users can read own readiness checks"
  on starter_readiness_checks for select using (auth.uid() = user_id);

create policy "Users can insert own readiness checks"
  on starter_readiness_checks for insert with check (auth.uid() = user_id);

create policy "Users can update own readiness checks"
  on starter_readiness_checks for update using (auth.uid() = user_id);

create policy "Users can delete own readiness checks"
  on starter_readiness_checks for delete using (auth.uid() = user_id);

-- ─── recipes ─────────────────────────────────────────────────────────────────
create table recipes (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references profiles(id) on delete cascade,
  title              text not null,
  source_url         text,
  ingredients        jsonb,
  steps              text,
  flour_type         text,
  hydration_percent  int,
  grade              int check (grade between 1 and 5),
  notes              text,
  visibility         text not null default 'private',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

alter table recipes enable row level security;

create policy "Users can read own recipes"
  on recipes for select using (auth.uid() = user_id);

create policy "Users can insert own recipes"
  on recipes for insert with check (auth.uid() = user_id);

create policy "Users can update own recipes"
  on recipes for update using (auth.uid() = user_id);

create policy "Users can delete own recipes"
  on recipes for delete using (auth.uid() = user_id);

-- ─── notification_settings ───────────────────────────────────────────────────
create table notification_settings (
  id               uuid primary key default gen_random_uuid(),
  starter_id       uuid not null references starters(id) on delete cascade,
  user_id          uuid not null references profiles(id) on delete cascade,
  enabled          boolean not null default true,
  reminder_time    time,
  timezone         text,
  expo_push_token  text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table notification_settings enable row level security;

create policy "Users can read own notification settings"
  on notification_settings for select using (auth.uid() = user_id);

create policy "Users can insert own notification settings"
  on notification_settings for insert with check (auth.uid() = user_id);

create policy "Users can update own notification settings"
  on notification_settings for update using (auth.uid() = user_id);

create policy "Users can delete own notification settings"
  on notification_settings for delete using (auth.uid() = user_id);

-- ─── updated_at triggers ─────────────────────────────────────────────────────
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger starters_updated_at
  before update on starters
  for each row execute function public.update_updated_at();

create trigger recipes_updated_at
  before update on recipes
  for each row execute function public.update_updated_at();

create trigger notification_settings_updated_at
  before update on notification_settings
  for each row execute function public.update_updated_at();
