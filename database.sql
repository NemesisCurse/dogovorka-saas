-- Скрипт для создания структуры БД в Supabase

-- 1. Профили пользователей (расширение auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  plan text default 'free' check (plan in ('free', 'start', 'pro')),
  checks_used int default 0,
  checks_limit int default 1,
  period_start timestamptz default now(),
  created_at timestamptz default now()
);

-- 2. Проверки договоров
create table public.checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  filename text,
  contract_type text,
  overall_risk_score int,
  summary text,
  report jsonb,
  created_at timestamptz default now()
);

-- 3. Включаем RLS (безопасность)
alter table public.profiles enable row level security;
alter table public.checks enable row level security;

create policy "own profile" on public.profiles for all using (auth.uid() = id);
create policy "own checks" on public.checks for all using (auth.uid() = user_id);

-- 4. Триггер автосоздания профиля
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();