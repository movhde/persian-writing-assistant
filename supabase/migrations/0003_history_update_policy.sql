-- Allows users to edit their own history rows (inline edit + re-run in the
-- detail view). Run once in the Supabase SQL Editor, after 0002.

create policy "Users can update their own history"
  on public.text_history for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
