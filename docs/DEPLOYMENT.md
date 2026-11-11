# Vercel deployment

Deploy this Next.js project with Node 24, `npm ci`, and `npm run build`.
Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in Vercel for production and preview. Only the Supabase publishable key belongs here; no service-role key is needed.

Apply the SQL migration in `supabase/migrations` to the Supabase project. Seed `office_agents` with `INITIAL_24_AGENTS` and import existing memory, approval, and Radar records into their matching tables as `{id, data}` rows using a privileged migration. Do not overwrite existing rows when importing. The deployed project already contains the existing 24 agents, memory, approval history, and Radar records.

In Supabase Authentication / URL Configuration, set Site URL to the production origin and allow `<production-origin>/auth/callback`. The first operator is `johnarveylopez0@gmail.com`. Open `/login`, choose Create account, confirm that email, and sign in. Additional operators require an administrator to add their verified email to `office_operators`; self-registration does not grant office access.

Every private page/API requires a verified session and allowlisted email. Database row-level policies independently enforce access. Approval decisions use conditional updates; immutable triggers record the verified reviewer and append audit events in the same transaction. Agent identity and department permissions cannot be changed through the public database API. No service-role key bypasses these checks.

Without Supabase settings, local development retains JSON storage and does not require sign-in. Vercel fails closed if configuration is missing. Tests use disposable local directories. Run `npm test`, `npm run lint`, and `npm run build`; run `tests/database-access.sql` through a privileged SQL connection to verify database boundaries (fixtures roll back).

Agent responses, Radar inputs, and external action receipts remain simulations. Persistent storage and authentication do not connect real AI models, social publishing, email sending, or financial systems. Do not use sandbox receipts as proof of external execution.

For a code rollback, redeploy the last authenticated release. Do not roll back to a release without access controls while retaining production data. Database changes are additive; export data before any destructive migration.
