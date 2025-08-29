FreePromptHub v2 (Astro + Tailwind)

Overview
- Clean, production-ready static site scaffold using Astro + Tailwind.
- File-based routes for pages and prompts.
- Client-side search via JSON index (no extra deps required).
- Netlify headers for CSP, caching, and security (single source of truth).

Quick Start
1) Migrate prompts from v1 into v2 data: node site-v2/tools/migrate-from-html.cjs
2) Install: npm install
3) Dev: npm run dev
4) Build: npm run build
5) Preview: npm run preview

Structure
- src/pages: top-level routes (/, /about, /contact, /privacy-policy, /terms-of-service, /search)
- src/pages/prompts/[category]/[slug].astro: dynamic prompt pages
- src/pages/prompts/[category]/index.astro: category listing pages
- src/data/prompts: JSON prompt metadata/content per category
- src/components: shared UI
- src/layouts: base layout with SEO helpers
- public: static assets, manifest, robots.txt, icons (placeholders)

Notes
- Add real PNG icons (apple-touch-icon.png, icon-192x192.png, icon-512x512.png, favicons) into public/.
- Replace public/og-image.png with your 1200x630 PNG OG image.
- Configure analytics (Plausible/GA4) in src/layouts/Base.astro if desired.
