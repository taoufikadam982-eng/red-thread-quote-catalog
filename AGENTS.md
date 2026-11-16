<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

- Share the quote selection through a root-level React provider so navigation preserves a visitor's current request without requiring an account.
- Keep catalogue models and recommendation logic browser-safe; load live visible products through a public read-only server function so admin edits reach every storefront surface.
- Content navigation uses individual TanStack leaf routes with per-page metadata so every named destination has a working URL.
- Prebundle shared Radix, Sonner and lazy document-reader dependencies with React at startup to prevent mixed React identities after dependency discovery in an open preview.
- Place admin UI under the authenticated layout and enforce separate server-side administrator middleware and RLS for every private action; UI gates alone never authorize writes.
- Serve private-bucket images only when attached to a visible product, through a narrow public image handler; workspace policy forbids public buckets.
- Parse product files locally with dedicated format readers and preview validated rows before atomic batch import; no AI service is needed for tabular documents.
- Keep quote context identity in a non-component module so Fast Refresh cannot disconnect mounted providers from consumers.
- Treat catalogue transport failures as recoverable: preserve cached products and quote state and keep sign-in accessible instead of throwing from the root loader.
- Keep storefront presentation and public consent intake separate from admin code; newsletter subscriptions use the existing private admin content inbox to avoid duplicating subscriber storage.
- Keep homepage slideshow artwork separate from live HTML copy and controls so messages remain accessible, with autoplay paused for interaction and reduced-motion preferences.
- Keep the homepage benefits strip fixed only on desktop and in normal flow on smaller screens, reserving space for the footer and floating contact button so controls remain accessible.
- Keep showroom Maps URLs in the shared browser-safe storefront module so the footer and contact page target the same provider-confirmed listing.
