# دستیار هوشمند نوشتار فارسی — Persian AI Writing Assistant

University capstone project: an RTL Persian writing assistant. Paste text, run
an AI operation (improve / summarize / tone / simplify), compare the result
against the original with word-level diff highlighting, see per-change
explanations and readability/formality scores. Auth, per-user history (with
inline edit/re-run/delete), and a usage dashboard included.

See `PROJECT_SUMMARY.md` for the full feature list, architecture, and
decision log.

## Stack

- Next.js (App Router) + TypeScript, Tailwind CSS v4, [motion](https://motion.dev)
- Supabase (Postgres + Auth)
- AI: provider-agnostic layer (`lib/ai`) — Gemini primary, Groq fallback.
  If Gemini fails (the dev sandbox this was built in is geo-blocked from the
  Gemini API — Vercel is not), the app automatically retries on Groq and
  surfaces which provider answered.
- `lib/persian/` — deterministic, non-AI Persian-language modules: a
  نیم‌فاصله (half-space/ZWNJ) corrector and a readability/formality scorer.
- Font: Vazirmatn, self-hosted via `@fontsource-variable/vazirmatn` (no
  runtime dependency on Google Fonts)

## Setup

```bash
pnpm install
cp .env.local.example .env.local   # fill in real values
pnpm dev
```

Required env vars (`.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GEMINI_API_KEY=
GEMINI_MODEL=            # optional, defaults to gemini-2.5-flash
GROQ_API_KEY=
GROQ_MODEL=               # optional, defaults to openai/gpt-oss-120b
```

### Database

Run the migrations in `supabase/migrations/` **in order** via the Supabase
SQL Editor (Dashboard → SQL Editor → paste → Run):

1. `0001_text_history.sql` — creates `text_history` with RLS (select/insert/delete)
2. `0002_history_changes_scores.sql` — adds `changes`/`score_before`/`score_after` columns
3. `0003_history_update_policy.sql` — adds the UPDATE RLS policy (needed for inline edit/re-run in the history detail view)

History and Dashboard won't have data to show until these are applied.

### Supabase Auth setting for demos

By default Supabase requires email confirmation and uses a shared SMTP
sender with a low rate limit (a few emails/hour) — fine for real use, but
easy to trip during a live demo if you sign up more than once or twice in a
row. For a smoother defense demo, consider Authentication → Sign In / Up →
disable "Confirm email" in the Supabase dashboard, or wire up your own SMTP
provider.

## Project structure

```
app/
  actions/            server actions (text operations)
  auth/               auth pages + server actions
  components/
    auth/             auth form, auth card wrapper
    dashboard/        stat tiles, breakdown/activity charts
    editor/           writing editor, diff view, score compare, changes panel
    history/          history list delete button, detail view
    landing/          hero, feature grid
    layout/           header, mobile nav, sign-out button
    ui/               shared logo, confirm-dialog button
  dashboard/          usage stats page
  history/            saved operations list + [id] detail page
lib/
  ai/                 provider-agnostic AI layer (types, prompts, providers/, parse-response)
  persian/            half-space corrector, readability scorer, numeral converter
  supabase/           Supabase client helpers (browser, server, middleware)
supabase/migrations/  SQL schema, in numbered order
```
