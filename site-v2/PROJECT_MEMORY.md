Project Memory — FreePromptHub (site‑v2)

Owner intent
- Build a high‑quality website for FreePromptHub, inspired by Claude’s version but with better UX, visuals, accessibility, and structure.
- Keep the same content “type” (prompt hub: landing, prompts list, detail, submit, about/blog), but not a 1:1 copy of Claude’s implementation.

Constraints & environment
- This workspace is at: FreePromptHub/site-v2. The Claude-built site exists in the parent folder (../). I cannot directly read outside this workspace with the current sandbox; copy or reference needed if we must mirror content.
- Network is restricted; avoid external CDNs. Prefer zero-build static assets (HTML/CSS/JS modules) that open locally or via a simple static server.

Planned deliverables (static site, no build)
- site/: index (landing), prompts listing with filters/search, prompt detail page, submit page, about, basic blog stub.
- Data: local JS data module to avoid fetch-from-file issues. Easy to swap for JSON/API later.
- UX: dark/light theme, keyboard a11y, responsive layout, tasteful motion.
- PWA: manifest + service worker for offline.

Next steps
1) Fill real prompts/content (replace seeds in site/data.js).
2) If needed, import content from Claude site into this workspace so I can map/migrate.
3) Optional: wire a simple backend or Git-based CMS for submissions.

