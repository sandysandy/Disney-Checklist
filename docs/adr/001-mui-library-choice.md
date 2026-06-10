# ADR 001: Base UI (unstyled MUI primitives) instead of MUI Material

## Status

Accepted

## Context

The component library must faithfully recreate the GOV.UK Design System. Two MUI
options were considered:

1. **MUI Material** with a heavy custom theme overriding Material Design.
2. **MUI's unstyled primitives**, styled entirely from govuk-frontend.

A note on naming: the package historically called "MUI Base" (`@mui/base`) never
left beta and is now deprecated. The MUI team's continuation of that work is
**Base UI** (`@base-ui-components/react`), which reached 1.0. This ADR treats
Base UI as "MUI Base UI", since it is the MUI team's supported unstyled
primitive library.

### Why not Material?

The GOV.UK visual and interaction language contradicts Material Design at almost
every level, not just superficially:

- **Visual**: flat, rectangular, hard 2px borders, no border radius (except the
  new brand's buttons), no elevation/shadows, no ripple, dense left-aligned
  typography, the yellow/black focus style required by WCAG. Achieving this with
  Material means disabling `Ripple`, `Elevation`, `borderRadius`, overriding
  every component's `styleOverrides`, and fighting Material's spacing and
  state-layer system — a permanent maintenance tax on every MUI upgrade.
- **Markup semantics**: GOV.UK components have *normative markup* (e.g. radios
  are real `<input type="radio">` elements inside a `<fieldset>` with a
  `<legend>`; tabs are a `<ul>` of links that fall back to in-page navigation
  without JavaScript; the select component is a native `<select>`). Material
  renders different DOM (e.g. `Select` is a button + popup listbox, radios are
  spans wrapping a hidden input), so assistive-technology behaviour would
  diverge from GOV.UK's tested behaviour even if pixels matched.
- **Accessibility conventions**: GOV.UK behaviours (error summary focus
  management, conditional reveals, character count live regions) are specified
  by GDS and tested with real assistive technology. Material's equivalents
  (helper text, floating labels) are different patterns, not different skins.

### Why Base UI?

Base UI provides behaviour and accessibility plumbing with **zero styling
opinion** and full control over rendered elements via its `render` prop, so we
can produce govuk-frontend's exact markup where a primitive helps and write
plain semantic HTML where the GOV.UK component is (by design) just HTML.

## Decision

Use **Base UI (`@base-ui-components/react`)**, MUI's unstyled primitive
library, selectively — and never MUI Material.

- All styling comes from the official `govuk-frontend` Sass (see ADR 002 and
  the token layer); components render govuk-frontend's documented markup and
  class names verbatim.
- Base UI primitives are used where they add real behavioural value
  (e.g. `useRender`/render-prop composition, collapsible/tabs state machines).
- Most GOV.UK components are intentionally native HTML (details, select,
  radios, checkboxes); for these, faithful semantic HTML plus small React
  behaviour hooks ported from govuk-frontend's own JavaScript is both simpler
  and more faithful than forcing a primitive in between.

## Consequences

- Pixel- and markup-fidelity to GOV.UK is achievable and stays stable across
  govuk-frontend upgrades, because styles are compiled from the upstream Sass.
- We take responsibility for behaviours Material would have provided; these are
  ported from govuk-frontend's own component JavaScript and covered by
  interaction tests.
- No Material dependency means no dead theme code and a much smaller bundle.
