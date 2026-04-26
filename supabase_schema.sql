-- Create a table for public profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  is_admin boolean default false,
  bio text,
  goal text,
  interests text,
  updated_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  
  constraint name_length check (char_length(full_name) >= 3)
);

-- AUTO-CREATE PROFILE ON SIGNUP
-- Run this to ensure users automatically get a row in the 'profiles' table
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, is_admin)
  values (new.id, new.raw_user_meta_data->>'full_name', false);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- (Existing policies stay the same)

-- Create a table for dynamic questions
create table if not exists questions (
  id bigint primary key generated always as identity,
  text text not null,
  options jsonb not null, -- Array of strings
  level_id int default 0, -- Added level association
  type text default 'assessment', -- Added question type
  created_at timestamp with time zone default now()
);

alter table questions enable row level security;

do $$ 
begin
  if not exists (select 1 from pg_policies where policyname = 'Questions are viewable by everyone.') then
    create policy "Questions are viewable by everyone." on questions for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Only admins can modify questions.') then
    create policy "Only admins can modify questions." on questions for all using (
      exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true)
    );
  end if;
end $$;

-- Create a table for tasks
create table if not exists tasks (
  id bigint primary key generated always as identity,
  title text not null,
  description text,
  duration text not null,
  trait text, -- Added trait mapping
  level_id int default 1, -- Added level association
  created_at timestamp with time zone default now()
);

alter table tasks enable row level security;

do $$ 
begin
  if not exists (select 1 from pg_policies where policyname = 'Tasks are viewable by everyone.') then
    create policy "Tasks are viewable by everyone." on tasks for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Only admins can modify tasks.') then
    create policy "Only admins can modify tasks." on tasks for all using (
      exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true)
    );
  end if;
end $$;

-- SEED DATA (Optional: Run this to populate initial content)
insert into questions (text, options) values
('What do you enjoy watching?', '["Documentaries & Tech", "Art & Design", "People talking & Drama", "Action & Fast-paced"]'),
('What type of tasks do you like?', '["Solving puzzles", "Creating visuals", "Organizing things", "Talking to people"]'),
('When faced with a complex problem, you...', '["Break it down logically", "Brainstorm wild ideas", "Look for a system", "Ask for opinions"]');

insert into tasks (title, duration, description, trait) values
('Record a 1-min explanation video', '15 min', 'Explain a concept you love to a camera.', 'creative'),
('Design a simple poster', '20 min', 'Create a visual representation of an idea.', 'creative'),
('Solve a logic problem', '15 min', 'Solve a riddle or math problem.', 'analytical');

-- HOW TO MAKE YOURSELF ADMIN
-- 1. Sign up in the app
-- 2. Go to the SQL Editor in Supabase
-- 3. Run the following command (replace with your email):
-- update profiles set is_admin = true where id in (select id from auth.users where email = 'your-email@example.com');

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

do $$ 
begin
  if not exists (select 1 from pg_policies where policyname = 'Public profiles are viewable by everyone.') then
    create policy "Public profiles are viewable by everyone." on profiles for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can insert their own profile.') then
    create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can update own profile.') then
    create policy "Users can update own profile." on profiles for update using (auth.uid() = id);
  end if;
end $$;

-- Create a table for discovery results (career recommendations)
create table if not exists results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  traits jsonb,
  career_recommendations jsonb,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table results enable row level security;

do $$ 
begin
  if not exists (select 1 from pg_policies where policyname = 'Users can view their own results.') then
    create policy "Users can view their own results." on results for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can insert their own results.') then
    create policy "Users can insert their own results." on results for insert with check (auth.uid() = user_id);
  end if;
end $$;

-- Create a table for session progress (to resume unfinished sessions)
create table if not exists discovery_sessions (
  user_id uuid references auth.users on delete cascade not null primary key,
  state jsonb not null,
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table discovery_sessions enable row level security;

do $$ 
begin
  if not exists (select 1 from pg_policies where policyname = 'Users can view their own sessions.') then
    create policy "Users can view their own sessions." on discovery_sessions for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can upsert their own sessions.') then
    create policy "Users can upsert their own sessions." on discovery_sessions for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can update their own sessions.') then
    create policy "Users can update their own sessions." on discovery_sessions for update using (auth.uid() = user_id);
  end if;
end $$;

-- Create a table for user task progress
create table if not exists user_tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  task_id bigint references tasks(id) on delete cascade not null,
  is_completed boolean default false,
  completed_at timestamp with time zone,
  
  unique(user_id, task_id)
);

alter table user_tasks enable row level security;

do $$ 
begin
  if not exists (select 1 from pg_policies where policyname = 'Users can view their own task status.') then
    create policy "Users can view their own task status." on user_tasks for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can update their own task status.') then
    create policy "Users can update their own task status." on user_tasks for all using (auth.uid() = user_id);
  end if;
end $$;

-- Create a table for task feedback
create table if not exists task_feedback (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  task_id bigint references tasks(id) on delete cascade not null,
  responses jsonb not null,
  created_at timestamp with time zone default now()
);

alter table task_feedback enable row level security;

do $$ 
begin
  if not exists (select 1 from pg_policies where policyname = 'Users can view their own feedback.') then
    create policy "Users can view their own feedback." on task_feedback for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can insert their own feedback.') then
    create policy "Users can insert their own feedback." on task_feedback for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Admins can view all feedback.') then
    create policy "Admins can view all feedback." on task_feedback for select using (
      exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true)
    );
  end if;
end $$;
