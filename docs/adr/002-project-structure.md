# ADR 002: Monorepo with npm workspaces

## Status

Accepted

## Context

The deliverables are (a) an importable, typed component library published
through Storybook and (b) a starter React app for rapidly assembling service
prototypes. They have different dependencies, build outputs and lifecycles, but
the starter app must always consume the current library source during
development.

## Decision

A single repository using **npm workspaces** (no extra monorepo tooling):

```
.
├── docs/adr/                  Architecture decision records
├── packages/
│   └── components/            @govuk-mui/react — the component library
│       ├── scripts/           Token generation from govuk-frontend Sass
│       ├── .storybook/        Storybook (docs + a11y addon)
│       └── src/
│           ├── tokens/        Typed design-token layer (generated + API)
│           ├── styles/        Sass entry compiling official govuk-frontend
│           ├── components/    One folder per GOV.UK component
│           └── patterns/      Page template + pattern compositions
└── apps/
    └── prototype/             @govuk-mui/prototype — Vite starter app
        └── src/pages/         Example journey + error pages
```

Key choices:

- **npm workspaces, no Lerna/Nx/Turbo**: two packages don't justify task-graph
  tooling; plain workspace scripts keep the prototype kit approachable.
- **Storybook lives inside the library package**, with stories colocated next
  to each component, so docs stay adjacent to implementation.
- **The starter app consumes library *source*** (`@govuk-mui/react` workspace
  link resolves to `src/` via the `./styles` export and Vite), so prototype
  authors see library changes instantly without a build step. The library also
  builds proper ESM + `.d.ts` + compiled CSS (`dist/`) for publication.
- **Generated tokens are committed** (`src/tokens/generated/tokens.ts`) so the
  package is usable straight from a clone; `npm run tokens` regenerates them
  after a govuk-frontend upgrade.

## Consequences

- One lockfile, one `npm install`, shared ESLint/Prettier/TypeScript config at
  the root.
- Library consumers outside the monorepo get a conventional npm package
  (`dist/index.js`, `dist/index.d.ts`, `dist/govuk-mui.css`).
- If more packages appear later (e.g. a Nunjucks-parity test harness), a task
  runner can be added without restructuring.
