/**
 * Generates the typed design-token layer from the official govuk-frontend
 * Sass source. govuk-frontend is the single source of truth: this script
 * compiles a small Sass program that calls `dump()` (a custom JS function)
 * with each settings map, then serialises the resolved values to
 * `src/tokens/generated/tokens.ts`.
 *
 * Re-run with `npm run tokens` after upgrading govuk-frontend.
 */
import * as sass from 'sass-embedded';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const govukPackageJson = require('govuk-frontend/package.json');
const nodeModules = path.resolve(require.resolve('govuk-frontend/package.json'), '..', '..');

const source = /* scss */ `
@use "sass:map";
@use "govuk-frontend/dist/govuk/settings" as s;
@use "govuk-frontend/dist/govuk/settings/colours-palette--internal" as pal;
@use "govuk-frontend/dist/govuk/helpers" as h;

$_: dump("palette", pal.$govuk-palette);
$_: dump("spacingPoints", s.$govuk-spacing-points);
$_: dump("spacingResponsiveScale", s.$govuk-spacing-responsive-scale);
$_: dump("typographyScale", s.$govuk-typography-scale);
$_: dump("breakpoints", s.$govuk-breakpoints);
$_: dump("fontFamily", s.$govuk-font-family);
$_: dump("rootFontSize", s.$govuk-root-font-size);
$_: dump("borderWidth", s.$govuk-border-width);
$_: dump("borderWidthWide", s.$govuk-border-width-wide);
$_: dump("borderWidthNarrow", s.$govuk-border-width-narrow);
$_: dump("borderWidthFormElement", s.$govuk-border-width-form-element);
$_: dump("borderWidthFormGroupError", s.$govuk-border-width-form-group-error);
$_: dump("focusWidth", s.$govuk-focus-width);
$_: dump("pageWidth", s.$govuk-page-width);

$functional: ();
@each $name, $definition in s.$govuk-functional-colours {
  $functional: map.set($functional, $name, h.govuk-functional-colour($name));
}
$_: dump("functionalColours", $functional);
`;

const tokens = {};

/** Convert a Sass value into plain JSON. Dimensions are normalised to px numbers. */
function toJs(value) {
  if (value instanceof sass.SassColor) {
    const channels = ['red', 'green', 'blue'].map((c) =>
      Math.round(value.channel(c, { space: 'rgb' })),
    );
    const hex = `#${channels.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
    const alpha = value.alpha;
    return alpha < 1 ? `rgba(${channels.join(', ')}, ${alpha})` : hex;
  }
  if (value instanceof sass.SassNumber) {
    if (value.numeratorUnits.size === 0) return value.value;
    if (value.numeratorUnits.size === 1 && value.numeratorUnits.get(0) === 'px') {
      return value.value;
    }
    return `${value.value}${Array.from(value.numeratorUnits).join('')}`;
  }
  if (value instanceof sass.SassString) return value.text;
  if (value instanceof sass.SassBoolean) return value.value;
  if (value === sass.sassNull) return null;
  if (value instanceof sass.SassMap) {
    const out = {};
    for (const [k, v] of value.contents.entries()) {
      out[k instanceof sass.SassString ? k.text : String(toJs(k))] = toJs(v);
    }
    return out;
  }
  if (value instanceof sass.SassList || value.asList?.size > 0) {
    return value.asList.toArray().map(toJs);
  }
  return String(value);
}

await sass.compileStringAsync(source, {
  loadPaths: [nodeModules],
  functions: {
    'dump($name, $value)': (args) => {
      tokens[args[0].assertString('name').text] = toJs(args[1]);
      return sass.sassNull;
    },
  },
});

// The font family list reads better joined back into a CSS value.
tokens.fontFamily = Array.isArray(tokens.fontFamily)
  ? tokens.fontFamily
      .map((f) => (typeof f === 'string' && f.includes(' ') ? `"${f}"` : f))
      .join(', ')
  : tokens.fontFamily;

const banner = `/**
 * GENERATED FILE — do not edit by hand.
 *
 * Design tokens extracted from govuk-frontend v${govukPackageJson.version} Sass settings
 * by scripts/generate-tokens.mjs. Run \`npm run tokens\` to regenerate.
 */
`;

const body = Object.entries(tokens)
  .map(([name, value]) => `export const ${name} = ${JSON.stringify(value, null, 2)} as const;`)
  .join('\n\n');

const outDir = path.join(here, '..', 'src', 'tokens', 'generated');
await mkdir(outDir, { recursive: true });
await writeFile(
  path.join(outDir, 'tokens.ts'),
  `${banner}\nexport const govukFrontendVersion = ${JSON.stringify(govukPackageJson.version)};\n\n${body}\n`,
);

console.log(`Tokens generated from govuk-frontend v${govukPackageJson.version}`);
