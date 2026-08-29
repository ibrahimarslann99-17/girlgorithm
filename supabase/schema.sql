-- =============================================================================
--  GIRLGORITHM — Supabase schema
--  Paste the whole file into Supabase → SQL Editor → Run. It is idempotent.
--
--  Design note: the anon key ships inside a public static page, so anyone can
--  read it out of the source. The table therefore has NO grants at all — anon
--  can only call the three SECURITY DEFINER functions at the bottom. That means
--  nobody can dump the table, update a row, or delete anything with that key.
-- =============================================================================

-- ---------- table -----------------------------------------------------------

create table if not exists public.runs (
  id            bigint generated always as identity primary key,
  code          text        not null unique,
  created_at    timestamptz not null default now(),

  -- what the user answered
  height        smallint not null check (height between 120 and 240),
  obese         boolean  not null,
  looks         text     not null check (looks  in ('ugly','normal','handsome')),
  adjust        text     not null check (adjust in ('fine','short','tall')),
  delta         smallint not null check (delta between -25 and 15),
  soft          smallint not null check (soft between 0 and 3),
  form          text     not null check (form   in ('muscle','neutral','fat')),
  effort        smallint not null check (effort between 0 and 3),
  room          text     not null check (room   in ('centre','edges','corner')),
  hot           smallint not null check (hot   between 4 and 10),
  crazy         smallint not null check (crazy between 4 and 10),

  -- what the model derived (stored so stats never recompute)
  target_height smallint not null check (target_height between 90 and 240),
  zone          text     not null,
  archetype     text     not null,
  one_in        bigint   not null check (one_in >= 1),
  flags         text[]   not null default '{}'
);

-- upgrade path for a table created before the build question was split in two
alter table public.runs drop column if exists body;
alter table public.runs add  column if not exists soft smallint;
alter table public.runs add  column if not exists form text;
alter table public.runs add  column if not exists effort smallint;
alter table public.runs add  column if not exists room text;

create index if not exists runs_created_idx   on public.runs (created_at desc);
create index if not exists runs_zone_idx      on public.runs (zone);
create index if not exists runs_archetype_idx on public.runs (archetype);

-- ---------- lock it down ----------------------------------------------------

alter table public.runs enable row level security;

-- No policies are created on purpose: with RLS on and zero policies, direct
-- REST access to the table returns nothing and accepts nothing.
revoke all on public.runs from anon, authenticated;

-- ---------- 1. submit -------------------------------------------------------
-- Writes one run, returns its share code. Throttled globally so a bored friend
-- with curl cannot fill the table faster than 40 rows a minute.

create or replace function public.submit_run(
  p_height        smallint,
  p_obese         boolean,
  p_looks         text,
  p_adjust        text,
  p_delta         smallint,
  p_soft          smallint,
  p_form          text,
  p_effort        smallint,
  p_room          text,
  p_hot           smallint,
  p_crazy         smallint,
  p_target_height smallint,
  p_zone          text,
  p_archetype     text,
  p_one_in        bigint,
  p_flags         text[]
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_recent int;
  v_code   text;
begin
  select count(*) into v_recent
    from public.runs
   where created_at > now() - interval '1 minute';

  if v_recent >= 40 then
    raise exception 'Slow down — too many runs in the last minute.'
      using errcode = 'P0001';
  end if;

  -- 6 chars, no vowels and no 0/O/1/I: unambiguous when read aloud in a group chat
  loop
    v_code := (
      select string_agg(substr('BCDFGHJKLMNPQRSTVWXYZ23456789',
                               1 + floor(random() * 29)::int, 1), '')
        from generate_series(1, 6)
    );
    exit when not exists (select 1 from public.runs where code = v_code);
  end loop;

  insert into public.runs (
    code, height, obese, looks, adjust, delta, soft, form, effort, room, hot, crazy,
    target_height, zone, archetype, one_in, flags
  ) values (
    v_code, p_height, p_obese, p_looks, p_adjust, p_delta, p_soft, p_form, p_effort, p_room, p_hot, p_crazy,
    p_target_height, p_zone, p_archetype, greatest(p_one_in, 1),
    coalesce(p_flags, '{}')
  );

  return v_code;
end;
$$;

-- ---------- 2. read one run by its share code -------------------------------

create or replace function public.get_run(p_code text)
returns json
language sql
security definer
set search_path = public
as $$
  select to_json(t) from (
    select code, created_at, height, obese, looks, adjust, delta, soft, form,
           effort, room, hot, crazy, target_height, zone, archetype, one_in, flags
      from public.runs
     where code = upper(trim(p_code))
     limit 1
  ) t;
$$;

-- ---------- 3. aggregate stats for the result screen ------------------------
-- p_one_in is the caller's own rarity, used only to compute their percentile.

create or replace function public.get_stats(p_one_in bigint default null)
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    'total',       (select count(*) from public.runs),
    'zones',       (select coalesce(json_agg(z), '[]'::json) from (
                      select zone, count(*)::int as n
                        from public.runs group by zone order by n desc) z),
    'archetypes',  (select coalesce(json_agg(a), '[]'::json) from (
                      select archetype, count(*)::int as n
                        from public.runs group by archetype order by n desc) a),
    'cops',        (select count(*) from public.runs where 'WATCHLIST'   = any(flags)),
    'handsome',    (select count(*) from public.runs where 'ORIENTATION' = any(flags)),
    'avg_height',  (select round(avg(height)::numeric, 1) from public.runs),
    'rarer_than',  case
                     when p_one_in is null then null
                     when (select count(*) from public.runs) = 0 then null
                     else (select round(100.0 * count(*) filter (where one_in < p_one_in)
                                        / greatest(count(*), 1))::int
                             from public.runs)
                   end
  );
$$;

-- ---------- grants ----------------------------------------------------------

revoke all on function public.submit_run(smallint,boolean,text,text,smallint,smallint,text,smallint,text,smallint,smallint,smallint,text,text,bigint,text[]) from public;
revoke all on function public.get_run(text)      from public;
revoke all on function public.get_stats(bigint)  from public;

grant execute on function public.submit_run(smallint,boolean,text,text,smallint,smallint,text,smallint,text,smallint,smallint,smallint,text,text,bigint,text[]) to anon, authenticated;
grant execute on function public.get_run(text)     to anon, authenticated;
grant execute on function public.get_stats(bigint) to anon, authenticated;
