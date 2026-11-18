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
- Product detail pages read the shared live catalogue and derive specifications only from published fields; catalogue links use the typed product route and reuse quote intake.
- Prebundle React entry points and shared Radix (including Popover), Sonner and lazy document-reader dependencies at startup; register new hook-consuming dependencies before use to prevent mixed React identities in an open preview.
- Place admin UI under the authenticated layout and enforce separate server-side administrator middleware and RLS for every private action; UI gates alone never authorize writes.
- Keep administrator login defaults separate from sales settings and show the authenticated account email; authorization remains role-based, not an email label.
- Serve private-bucket images only when attached to a visible product, through a narrow public image handler; workspace policy forbids public buckets.
- Parse product files locally with dedicated format readers and preview validated rows before atomic batch import; no AI service is needed for tabular documents.
- Keep quote context identity in a non-component module so Fast Refresh cannot disconnect mounted providers from consumers.
- Treat catalogue transport failures as recoverable: preserve cached products and quote state and keep sign-in accessible instead of throwing from the root loader.
- Keep storefront presentation and public consent intake separate from admin code; newsletter subscriptions use the existing private admin content inbox to avoid duplicating subscriber storage.
- Keep homepage slideshow artwork separate from live HTML copy and controls so messages remain accessible, with autoplay paused for interaction and reduced-motion preferences.
- Keep homepage mobile slide artwork below the md breakpoint and desktop artwork at md and above; preserve portrait aspect ratio so equipment is not cropped.
- Keep the desktop benefits presentation unchanged; mount the mobile quote CTA in the shared public footer, hide it for visible legal links, consent or the quote sheet, and position WhatsApp above it to avoid collisions.
- Keep showroom Maps URLs in the shared browser-safe storefront module so the footer and contact page target the same provider-confirmed listing.
- Keep enterprise quote preparation in a dedicated browser-side page and hand its summary to the existing quote form; this preserves one secure submission path without duplicating intake logic.
- Keep Boutique filters browser-side and derive technical facets only from visible product specifications; this avoids inventing catalogue attributes or copying competitor inventory.

- Keep phone storefront navigation in an accessible sheet and admin navigation in a dismissing overlay; use mobile-only layouts and contained scrolling tables so desktop presentation remains unchanged.
- Home-screen installation uses a manifest and branded icons only; do not add app-shell caching or service workers unless offline support is requested.
- Keep one shared SESA contact-and-map section in the storefront footer so every page uses the same showroom details without duplicate panels.
- Keep social profile destinations in the shared browser-safe storefront module and render them through one footer component, so the icon row stays identical on every page.
- Use the shared consent module as the authority for analytics choices; the SESA storage key is only a compatibility receipt, and privacy copy must describe actual tracking.
- Keep header menu destinations in one browser-safe list and pass category/brand selections through validated Boutique search parameters so desktop, mobile and brand pages stay consistent.
- Use the same max-w-7xl centered responsive container for both header rows so catalogue and quote controls align with the logo and quote-list edges.
- Specialized enterprise intake extends the shared quote schema and inbox, validating ICE/contact/procedure on both sides and preserving those details in the stored request message.
- Render partner strips through one shared component with separate desktop artwork and mobile logo links; duplicate the mobile track for seamless motion and pause on touch/focus or reduced-motion preferences.
- Derive the PC finder diagnostic from committed answers plus the current choice in a browser-safe helper, so revisiting questions cannot show stale future criteria.
- Use one shared timed questionnaire hook on all devices, with a synchronous input lock and timer cancellation on Previous, restart and unmount, to prevent accidental question skips.
- Share local category selection between cards and catalogue on each catalogue surface; scroll after filter updates with measured sticky-header clearance and pass category quote text through the root quote provider.
- Blog articles live in blog_posts; uploaded covers go to the private catalogue bucket under blog/ and are served only when attached to a published post via the public image handler.
