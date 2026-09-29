-- Run in Supabase SQL editor
create table if not exists creators (
  id text primary key,
  name text not null,
  niche text
);

create table if not exists reels (
  id uuid primary key default gen_random_uuid(),
  creator_id text references creators(id),
  posted_at timestamptz default now(),
  hook_type text not null,
  topic text,
  length_sec int,
  caption_style text,
  post_hour int,
  views int default 0,
  saves int default 0,
  shares int default 0,
  comments_count int default 0
);

create table if not exists pattern_scores (
  creator_id text references creators(id),
  hook_type text,
  score float default 0.5,
  n int default 0,
  updated_at timestamptz default now(),
  primary key (creator_id, hook_type)
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  reel_id uuid references reels(id),
  text text,
  sentiment text
);

-- Hackathon shortcut: use the service_role key in .env, or disable RLS on these tables.
