-- Persian Writing Assistant: text_history table
-- Stores every AI operation a user runs, for the History and Dashboard features.
-- Run this once in the Supabase SQL Editor (or via `supabase db push` if you use the CLI).

create table if not exists public.text_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  operation text not null check (
    operation in ('improve', 'summarize', 'tone-formal', 'tone-informal', 'simplify')
  ),
  input_text text not null,
  output_text text not null,
  provider text not null,
  created_at timestamptz not null default now()
);

create index if not exists text_history_user_id_created_at_idx
  on public.text_history (user_id, created_at desc);

alter table public.text_history enable row level security;

create policy "Users can view their own history"
  on public.text_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own history"
  on public.text_history for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own history"
  on public.text_history for delete
  using (auth.uid() = user_id);
