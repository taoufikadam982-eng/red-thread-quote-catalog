# Catalogue rules

- Share derived offer detection (flag, higher old price or offer tag) across filters/badges; legacy imports preserve saved offer fields.
- Extract shared card pills with category-aware technical keyword matching; never split imported prose on commas or invent missing specifications.
- Delete products through administrator middleware and user-scoped RLS, with explicit confirmation; preserve historical quote snapshots and unrelated unsaved edits.
- Share accent-insensitive visible-product search between header suggestions and Boutique results; retain legacy q URLs alongside the search parameter.
- Compare brands through product-brands with trimmed, case-insensitive values for filters, options and checkbox state; imported casing must not hide products linked from menus.
- Product-page AI recommendations validate model ids against the visible catalogue and fall back to same-category items, so the section never shows invented or hidden products.
