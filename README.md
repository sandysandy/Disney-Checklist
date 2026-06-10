# GOV.UK Design System on MUI — React component library + prototype kit

A TypeScript React component library that faithfully recreates the
[GOV.UK Design System](https://design-system.service.gov.uk), published through
Storybook, with a starter Vite app for rapidly assembling service prototypes.

- **Behaviour & accessibility**: matches the GOV.UK Design System (markup
  semantics, keyboard behaviour, ARIA usage, error states), not Material
  Design. Built on [Base UI](https://base-ui.com) — MUI's unstyled primitive
  library — where primitives genuinely help. See
  [ADR 001](docs/adr/001-mui-library-choice.md).
- **Styling**: nothing hand-recreated. All CSS is compiled from the official
  [`govuk-frontend`](https://www.npmjs.com/package/govuk-frontend) Sass, and a
  typed design-token layer is generated from the same Sass settings.
- **Structure**: npm-workspaces monorepo — see
  [ADR 002](docs/adr/002-project-structure.md).

```
packages/components   @govuk-mui/react — the component library + Storybook
apps/prototype        @govuk-mui/prototype — starter app with an example journey
docs/adr              architecture decision records
```

## Getting started

```bash
npm install
npm run storybook     # component workshop at http://localhost:6006
npm run dev           # starter app at http://localhost:5173
npm test              # unit/interaction tests (Testing Library + axe)
npm run lint          # ESLint (strict TypeScript, no `any`)
npm run build         # library dist/ + app build
```

## The design-token layer

`packages/components/src/tokens/generated/tokens.ts` is generated from
govuk-frontend's Sass settings (colour palette, functional colours, spacing
scale, typography scale, breakpoints, measurements) by:

```bash
npm run tokens
```

The typed API mirrors the Sass functions:

```ts
import { govukColour, govukFunctionalColour, govukSpacing } from '@govuk-mui/react';

govukColour('blue'); // "#1d70b8"
govukColour('blue', 'tint-95'); // "#f4f8fb"
govukFunctionalColour('focus'); // "var(--govuk-focus-colour, #ffdd00)"
govukSpacing(3); // "15px"
```

Regenerate after upgrading govuk-frontend; the generated file is committed so
the package works straight from a clone.

## Font licensing (GDS Transport)

The GDS Transport font is **only licensed for use on the gov.uk domain**. This
library therefore overrides govuk-frontend's font stack to fall back to
Arial/sans-serif (see `packages/components/src/styles/index.scss`).

A genuine government service running on gov.uk should restore the real font by
removing the override so govuk-frontend's default
(`"GDS Transport", arial, sans-serif`) and its `@font-face` rules apply:

```scss
// packages/components/src/styles/index.scss
@use 'govuk-frontend/dist/govuk' as govuk; // no `with (...)` override
```

…and serve the font files from `$govuk-assets-path` (this repo already serves
`govuk-frontend/dist/govuk/assets` at `/assets` in both Storybook and the app,
so the fonts are picked up automatically once the override is removed).

## Adding a new prototype page

1. Create a page component in `apps/prototype/src/pages/`, composing the
   `PageTemplate` / `QuestionPage` patterns from `@govuk-mui/react`.
2. Register a route for it in `apps/prototype/src/App.tsx`.
3. Link to it with the form's submit handler or a link — one thing per page,
   per the GOV.UK [question pages pattern](https://design-system.service.gov.uk/patterns/question-pages/).

The example journey (start page → question pages → check answers →
confirmation) in `apps/prototype/src/pages/` shows the full shape, including
storing answers in React context and the error-summary validation pattern.

## Storybook

Every component and pattern has stories with controls for all meaningful props,
autodocs usage notes with a link to the corresponding GOV.UK Design System
page, and the accessibility addon (`@storybook/addon-a11y`) set to **fail on
any axe violation**.

Build a static Storybook for publishing to any static host (GitHub Pages,
Netlify, S3…):

```bash
npm run storybook:build
# output in packages/components/storybook-static/
```

## Quality bar

- WCAG 2.2 AA; behaviours ported from govuk-frontend's own component
  JavaScript (error summary focus management, character count live
  announcements, conditional reveals, accordion/tabs keyboard support).
- Interaction tests with Testing Library; automated axe checks across
  components via jest-axe and across stories via the a11y addon.
- Strict TypeScript everywhere; ESLint + Prettier; no `any`.
