-- Adds per-operation explanations and readability/formality scores to
-- text_history. Run this once in the Supabase SQL Editor, after
-- 0001_text_history.sql.

alter table public.text_history
  add column if not exists changes jsonb not null default '[]'::jsonb,
  add column if not exists score_before jsonb,
  add column if not exists score_after jsonb;
