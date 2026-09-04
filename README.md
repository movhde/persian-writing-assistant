# دستیار هوشمند نوشتار فارسی — Persian AI Writing Assistant

University capstone project: an RTL Persian writing assistant. Paste text, run
an AI operation (improve / summarize / tone / simplify), compare the result
against the original with word-level diff highlighting. Auth, per-user
history, and a usage dashboard included.

## Stack

- Next.js (App Router) + TypeScript, Tailwind CSS v4
- Supabase (Postgres + Auth)
- AI: provider-agnostic layer (`lib/ai`) — Gemini primary, Groq fallback.
  If Gemini fails (the dev sandbox this was built in is geo-blocked from the
  Gemini API — Vercel is not), the app automatically retries on Groq and
  surfaces which provider answered.
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

Run `supabase/migrations/0001_text_history.sql` once in the Supabase SQL
Editor (Dashboard → SQL Editor → paste → Run). It creates `text_history`
with row-level security so each user can only see their own rows. History
and Dashboard won't have data to show until this is applied.

### Supabase Auth setting for demos

By default Supabase requires email confirmation and uses a shared SMTP
sender with a low rate limit (a few emails/hour) — fine for real use, but
easy to trip during a live demo if you sign up more than once or twice in a
row. For a smoother defense demo, consider Authentication → Providers →
Email → disable "Confirm email" in the Supabase dashboard, or wire up your
own SMTP provider.

## Project structure

```
app/
  actions/           server actions (text operations)
  auth/               auth pages + server actions
  components/
    auth/             auth form
    editor/           writing editor, diff view
    layout/            header, sign-out button
  dashboard/          usage stats page
  history/             saved operations page
lib/
  ai/                 provider-agnostic AI layer (types, prompts, providers/)
  supabase/           Supabase client helpers (browser, server, middleware)
supabase/migrations/  SQL schema
```
