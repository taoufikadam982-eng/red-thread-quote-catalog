# Catalogue rules

- Share derived offer detection (flag, higher old price or offer tag) across filters/badges; legacy imports preserve saved offer fields.
- Extract shared card pills with category-aware technical keyword matching; never split imported prose on commas or invent missing specifications.
- Delete products through administrator middleware and user-scoped RLS, with explicit confirmation; preserve historical quote snapshots and unrelated unsaved edits.
- Share accent-insensitive visible-product search between header suggestions and Boutique results; retain legacy q URLs alongside the search parameter.
- Compare brands through product-brands with trimmed, case-insensitive values for filters, options and checkbox state; imported casing must not hide products linked from menus.
- Product-page AI recommendations validate model ids against the visible catalogue and fall back to same-category items, so the section never shows invented or hidden products.
- Detailed product sheets (intro, highlights, use cases, extra info, spec groups) are optional product columns saved by a separate admin function; an empty sheet keeps the legacy text-derived display.
- Repair mojibake (UTF-8 read as Latin-1) via text-repair on public product reads and sheet saves, so pasted or imported descriptions display correct accents.
- Keep monitor datasheet parsing and summary selection browser-safe in product-monitor; group published labels and preserve connector lists/decimal values instead of guessing model specifications.
