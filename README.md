# Micro Automation Hub (scaffold)

Initial Next.js + Tailwind scaffold for the Micro Automation Hub platform. The project sets up a hybrid 2D shell with routes for the automation library, failure atlas, training content, insights, roadmap, and a placeholder 3D explorer fallback.

## Getting started

```bash
npm install
npm run dev
```

The development server runs on [http://localhost:3000](http://localhost:3000).

## Structure

- `app/` – App Router pages. Landing page lives at `/`, while authenticated workspace views live under the `(app)` route group.
- `components/` – Shared UI primitives including the navigation shell.
- `tailwind.config.ts` – Tailwind theme tuned for the dark, neon-accented 2D experience.

## Next steps

- Wire the pages to real data sources and API contracts.
- Integrate command palette, auth, and RBAC-aware navigation.
- Embed Spline/Three.js canvases behind feature detection on the explorer routes.
- Expand shared component library for cards, tables, and graph visualizations.
