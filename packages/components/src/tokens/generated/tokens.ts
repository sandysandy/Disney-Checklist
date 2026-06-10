/**
 * GENERATED FILE — do not edit by hand.
 *
 * Design tokens extracted from govuk-frontend v6.2.0 Sass settings
 * by scripts/generate-tokens.mjs. Run `npm run tokens` to regenerate.
 */

export const govukFrontendVersion = '6.2.0';

export const palette = {
  blue: {
    primary: '#1d70b8',
    'tint-25': '#5694ca',
    'tint-50': '#8eb8dc',
    'tint-80': '#d2e2f1',
    'tint-95': '#f4f8fb',
    'shade-25': '#16548a',
    'shade-50': '#0f385c',
    'shade-10': '#1a65a6',
  },
  green: {
    primary: '#0f7a52',
    'tint-25': '#4b9b7d',
    'tint-50': '#87bca8',
    'tint-80': '#cfe4dc',
    'tint-95': '#f3f8f6',
    'shade-25': '#0b5c3e',
    'shade-50': '#083d29',
  },
  teal: {
    primary: '#158187',
    'tint-25': '#50a1a5',
    'tint-50': '#8ac0c3',
    'tint-80': '#d0e6e7',
    'tint-95': '#f3f9f9',
    'shade-25': '#106165',
    'shade-50': '#0b4144',
    accent: '#00ffe0',
  },
  purple: {
    primary: '#54319f',
    'tint-25': '#7f65b7',
    'tint-50': '#aa98cf',
    'tint-80': '#ddd6ec',
    'tint-95': '#f6f5fa',
    'shade-25': '#3f2577',
    'shade-50': '#2a1950',
  },
  magenta: {
    primary: '#ca357c',
    'tint-25': '#d7689d',
    'tint-50': '#e59abe',
    'tint-80': '#f4d7e5',
    'tint-95': '#fcf5f8',
    'shade-25': '#98285d',
    'shade-50': '#651b3e',
  },
  red: {
    primary: '#ca3535',
    'tint-25': '#d76868',
    'tint-50': '#e59a9a',
    'tint-80': '#f4d7d7',
    'tint-95': '#fcf5f5',
    'shade-25': '#982828',
    'shade-50': '#651b1b',
  },
  orange: {
    primary: '#f47738',
    'tint-25': '#f7996a',
    'tint-50': '#fabb9c',
    'tint-80': '#fde4d7',
    'tint-95': '#fef8f5',
    'shade-25': '#b7592a',
    'shade-50': '#7a3c1c',
  },
  yellow: {
    primary: '#ffdd00',
    'tint-25': '#ffe640',
    'tint-50': '#ffee80',
    'tint-80': '#fff8cc',
    'tint-95': '#fffdf2',
    'shade-25': '#bfa600',
    'shade-50': '#806f00',
  },
  brown: {
    primary: '#99704a',
    'tint-25': '#b39477',
    'tint-50': '#ccb8a5',
    'tint-95': '#faf8f6',
  },
  black: {
    primary: '#0b0c0c',
    'tint-25': '#484949',
    'tint-50': '#858686',
    'tint-80': '#cecece',
    'tint-95': '#f3f3f3',
  },
  white: '#ffffff',
} as const;

export const spacingPoints = {
  '0': 0,
  '1': 5,
  '2': 10,
  '3': 15,
  '4': 20,
  '5': 25,
  '6': 30,
  '7': 40,
  '8': 50,
  '9': 60,
} as const;

export const spacingResponsiveScale = {
  '0': {
    null: 0,
  },
  '1': {
    null: 5,
  },
  '2': {
    null: 10,
  },
  '3': {
    null: 15,
  },
  '4': {
    null: 15,
    tablet: 20,
  },
  '5': {
    null: 15,
    tablet: 25,
  },
  '6': {
    null: 20,
    tablet: 30,
  },
  '7': {
    null: 25,
    tablet: 40,
  },
  '8': {
    null: 30,
    tablet: 50,
  },
  '9': {
    null: 40,
    tablet: 60,
  },
} as const;

export const typographyScale = {
  '16': {
    null: {
      'font-size': 16,
      'line-height': 20,
    },
    print: {
      'font-size': '14pt',
      'line-height': 1.2,
    },
  },
  '19': {
    null: {
      'font-size': 19,
      'line-height': 25,
    },
    print: {
      'font-size': '14pt',
      'line-height': 1.15,
    },
  },
  '24': {
    null: {
      'font-size': 21,
      'line-height': 25,
    },
    tablet: {
      'font-size': 24,
      'line-height': 30,
    },
    print: {
      'font-size': '18pt',
      'line-height': 1.15,
    },
  },
  '27': {
    null: {
      'font-size': 21,
      'line-height': 25,
    },
    tablet: {
      'font-size': 27,
      'line-height': 30,
    },
    print: {
      'font-size': '18pt',
      'line-height': 1.15,
    },
  },
  '36': {
    null: {
      'font-size': 27,
      'line-height': 30,
    },
    tablet: {
      'font-size': 36,
      'line-height': 40,
    },
    print: {
      'font-size': '24pt',
      'line-height': 1.05,
    },
  },
  '48': {
    null: {
      'font-size': 32,
      'line-height': 35,
    },
    tablet: {
      'font-size': 48,
      'line-height': 50,
    },
    print: {
      'font-size': '32pt',
      'line-height': 1.15,
    },
  },
  '80': {
    null: {
      'font-size': 53,
      'line-height': 55,
    },
    tablet: {
      'font-size': 80,
      'line-height': 80,
    },
    print: {
      'font-size': '53pt',
      'line-height': 1.1,
    },
  },
} as const;

export const breakpoints = {
  mobile: 320,
  tablet: 641,
  desktop: 769,
} as const;

export const fontFamily = '"GDS Transport", arial, sans-serif' as const;

export const rootFontSize = 16 as const;

export const borderWidth = 5 as const;

export const borderWidthWide = 10 as const;

export const borderWidthNarrow = 4 as const;

export const borderWidthFormElement = 2 as const;

export const borderWidthFormGroupError = 5 as const;

export const focusWidth = 3 as const;

export const pageWidth = 960 as const;

export const functionalColours = {
  brand: 'var(--govuk-brand-colour, #1d70b8)',
  text: 'var(--govuk-text-colour, #0b0c0c)',
  'template-background': 'var(--govuk-template-background-colour, #f4f8fb)',
  'body-background': 'var(--govuk-body-background-colour, #ffffff)',
  'print-text': 'var(--govuk-print-text-colour, #000000)',
  'secondary-text': 'var(--govuk-secondary-text-colour, #484949)',
  focus: 'var(--govuk-focus-colour, #ffdd00)',
  'focus-text': 'var(--govuk-focus-text-colour, #0b0c0c)',
  error: 'var(--govuk-error-colour, #ca3535)',
  success: 'var(--govuk-success-colour, #0f7a52)',
  border: 'var(--govuk-border-colour, #cecece)',
  'input-border': 'var(--govuk-input-border-colour, #0b0c0c)',
  hover: 'var(--govuk-hover-colour, #cecece)',
  link: 'var(--govuk-link-colour, #1a65a6)',
  'link-visited': 'var(--govuk-link-visited-colour, #54319f)',
  'link-hover': 'var(--govuk-link-hover-colour, #0f385c)',
  'link-active': 'var(--govuk-link-active-colour, #0b0c0c)',
  'surface-background': 'var(--govuk-surface-background-colour, #f4f8fb)',
  'surface-text': 'var(--govuk-surface-text-colour, #0b0c0c)',
  'surface-border': 'var(--govuk-surface-border-colour, #8eb8dc)',
} as const;
