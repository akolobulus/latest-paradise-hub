-- Run this in Supabase SQL Editor to make course-completion points idempotent
-- and to back the leaderboard streak with real daily activity.

alter table public.enrollments
  add column if not exists course_completed boolean not null default false;

alter table public.profiles
  add column if not exists streak integer not null default 0,
  add column if not exists last_activity_date date;

create table if not exists public.user_activity_days (
  user_id uuid references public.profiles(id) on delete cascade not null,
  activity_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, activity_date)
);

alter table public.user_activity_days enable row level security;

drop policy if exists "Users can view own activity days" on public.user_activity_days;
create policy "Users can view own activity days" on public.user_activity_days
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own activity days" on public.user_activity_days;
create policy "Users can insert own activity days" on public.user_activity_days
  for insert with check (auth.uid() = user_id);

create or replace function public.increment_course_points(
  user_id_input uuid,
  course_id_input int
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  did_mark_complete boolean := false;
begin
  update public.enrollments
  set course_completed = true
  where user_id = user_id_input
    and course_id = course_id_input
    and course_completed = false
  returning true into did_mark_complete;

  if coalesce(did_mark_complete, false) then
    update public.profiles
    set points = coalesce(points, 0) + 50
    where id = user_id_input;

    return true;
  end if;

  return false;
end;
$$;

create or replace function public.log_activity_and_update_streak()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  today date := (now() at time zone 'utc')::date;
  previous_activity date;
  new_streak integer := 1;
begin
  if current_user_id is null then
    return null;
  end if;

  insert into public.user_activity_days (user_id, activity_date)
  values (current_user_id, today)
  on conflict (user_id, activity_date) do nothing;

  select last_activity_date
  into previous_activity
  from public.profiles
  where id = current_user_id;

  if previous_activity = today then
    select streak into new_streak from public.profiles where id = current_user_id;
  elsif previous_activity = today - 1 then
    update public.profiles
    set streak = coalesce(streak, 0) + 1,
        last_activity_date = today
    where id = current_user_id
    returning streak into new_streak;
  else
    update public.profiles
    set streak = 1,
        last_activity_date = today
    where id = current_user_id
    returning streak into new_streak;
  end if;

  return coalesce(new_streak, 0);
end;
$$;
