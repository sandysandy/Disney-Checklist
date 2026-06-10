/**
 * Typed design-token layer, sourced from the official govuk-frontend Sass
 * settings (see scripts/generate-tokens.mjs). Mirrors the govuk-frontend
 * Sass API: `govukColour()`, `govukFunctionalColour()` and `govukSpacing()`
 * behave like their Sass counterparts.
 */
import type { typographyScale } from './generated/tokens';
import { breakpoints, functionalColours, palette, spacingPoints } from './generated/tokens';

export * from './generated/tokens';

export type PaletteColour = keyof typeof palette;
export type PaletteVariant<C extends PaletteColour> = keyof (typeof palette)[C];
export type FunctionalColour = keyof typeof functionalColours;
export type SpacingPoint = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Breakpoint = keyof typeof breakpoints;
export type TypographySize = keyof typeof typographyScale;

/** Equivalent of the Sass `govuk-colour($colour, $variant)` function. */
export function govukColour<C extends PaletteColour>(
  colour: C,
  variant: PaletteVariant<C> = 'primary' as PaletteVariant<C>,
): string {
  return palette[colour][variant] as string;
}

/**
 * Equivalent of the Sass `govuk-functional-colour($colour)` function.
 * Returns a CSS custom-property reference with a static fallback, so values
 * respond to govuk-frontend's runtime theming.
 */
export function govukFunctionalColour(colour: FunctionalColour): string {
  return functionalColours[colour];
}

/**
 * Equivalent of the Sass `govuk-spacing($spacing-point)` function.
 * Accepts negative points, e.g. `govukSpacing(-2) === '-10px'`.
 */
export function govukSpacing(
  point: SpacingPoint | -1 | -2 | -3 | -4 | -5 | -6 | -7 | -8 | -9,
): string {
  const value = spacingPoints[String(Math.abs(point)) as keyof typeof spacingPoints];
  return `${point < 0 ? -value : value}px`;
}

/** Min-width media query for a govuk-frontend breakpoint. */
export function govukMediaQuery(from: Breakpoint): string {
  return `@media (min-width: ${breakpoints[from]}px)`;
}
