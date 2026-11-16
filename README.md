# EcoSindh AI — starter project

A beginner-friendly research-library MVP built with Vite, React and Supabase.

## What is included
- Responsive EcoSindh AI research-library interface.
- Search by title, agency, summary and Sindh relevance.
- Topic and record-type filters.
- Supabase PostgreSQL schema with public read-only Row Level Security.
- Initial digest metadata for 4 reported new publications, 2 older documents, 2 agency updates and 3 pending-verification entries.

## Important data-integrity note
The initial digest came from the prior research conversation. The seed intentionally leaves `source_url` blank until each exact original document URL is rechecked. The records are not represented as independently re-verified by this starter package. Historical measurements and forecasts are labelled separately in `measurement_period` and the summaries.

## Setup
1. Create a GitHub repository named `ecosindh-ai`.
2. Upload the contents of this folder to the repository root.
3. Create a Supabase project.
4. In Supabase, open SQL Editor, paste `supabase/schema_and_seed.sql`, and run it.
5. In Supabase project settings, copy the Project URL and publishable/anon key. Never use a `service_role` or secret key in browser code.
6. In the project root, create `.env` with:
   `VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co`
   `VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY`
7. Install dependencies and run locally:
   `npm install`
   `npm run dev`
8. For deployment, import the GitHub repository into Vercel and add the same two environment variables in Project Settings > Environment Variables. Deploy.

## Security
- The browser uses only the Supabase publishable/anon key.
- RLS allows public SELECT of published rows only.
- Do not expose database passwords, service-role keys, or secret API keys in GitHub or frontend environment variables.
- Add authenticated admin workflows before allowing edits or uploads.

## Next improvements
- Verify and populate every original source URL.
- Add admin authentication and a review/publish workflow.
- Add district and language metadata, source-document storage, and automated weekly monitoring.
