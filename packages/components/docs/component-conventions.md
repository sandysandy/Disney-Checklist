# Component conventions

Every component in `src/components/` follows the same pattern. `Button` and
`TextInput` are the reference implementations — read them first.

## Source of truth

The component must faithfully reproduce the GOV.UK Design System
implementation, not approximate it:

- **Markup and classes**: mirror the Nunjucks template at
  `node_modules/govuk-frontend/dist/govuk/components/<name>/template.njk`
  exactly (class names, element choice, aria attributes, data-module
  attributes, visually hidden text).
- **Behaviour**: port the logic from
  `node_modules/govuk-frontend/dist/govuk/components/<name>/<name>.mjs`
  (focus management, key handling, live regions, sessionStorage, i18n default
  strings) into React hooks/handlers.
- **Styling**: none. All CSS comes from the govuk-frontend Sass already
  compiled via `src/styles/index.scss`. Never write component CSS.

## File layout

```
src/components/<PascalName>/
├── <PascalName>.tsx          implementation
├── <PascalName>.stories.tsx  Storybook stories
├── <PascalName>.test.tsx     Testing Library + axe tests
└── index.ts                  re-export of component + prop types
```

## Props API

- Mirror the govuk-frontend macro options, translated to idiomatic React:
  `text`/`html` pairs become a single `ReactNode` prop; `classes` becomes
  `className`; nested option objects become flat props where sensible
  (see `TextInput`'s `label`, `labelSize`, `labelIsPageHeading`).
- Extend the native element's prop type and spread `...rest` onto it so
  consumers can pass any standard attribute.
- Use `forwardRef` on components whose root is interactive or focusable.
- Generate ids with `useOptionalId` (src/internal/useId.ts); join classes with
  `classNames` (src/internal/classNames.ts).
- Form components compose `FormGroup`, `Label`, `Hint` and `ErrorMessage`, and
  chain `aria-describedby` in the order: explicit `describedBy` prop, hint id,
  error id (matching the Nunjucks templates).
- Components with visible UI text (e.g. "Show all sections") expose the
  govuk-frontend i18n strings as optional props with the official defaults.
- Strict TypeScript, no `any`. Exported prop interfaces are named
  `<PascalName>Props`.

## Stories

- `title: 'Components/<GOV.UK component name>'` (sentence case, as on
  design-system.service.gov.uk).
- A `docs.description.component` block summarising the GOV.UK "when to use /
  when not to use" guidance, ending with a link to the component's page on
  https://design-system.service.gov.uk/components/.
- Controls (`argTypes`) for every meaningful prop; one named story per
  documented GOV.UK variant.
- Autodocs is enabled globally — do not add `tags` manually.

## Tests

- Testing Library + `user-event` for behaviour: keyboard interaction, focus
  management, aria state changes — the things the govuk-frontend JS does.
- An axe check: `expect(await axe(container)).toHaveNoViolations()`.
- Run scoped checks before finishing:
  `npx vitest run src/components/<Name>`,
  `npx tsc -p tsconfig.json`,
  `npx eslint src/components/<Name>`,
  `npx prettier --write src/components/<Name>`.
