import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  breakpoints,
  functionalColours,
  govukFrontendVersion,
  palette,
  spacingPoints,
  typographyScale,
} from './index';

/**
 * The typed design-token layer is generated from the official govuk-frontend
 * Sass settings — nothing is recreated by hand. Import tokens from
 * `@govuk-mui/react` when you need programmatic access to colours, spacing or
 * breakpoints (for example in custom visualisations).
 */
const meta = {
  title: 'Tokens/Design tokens',
  parameters: {
    docs: {
      description: {
        component: `Design tokens extracted from govuk-frontend v${govukFrontendVersion} Sass settings by \`npm run tokens\`. Functional colours resolve to CSS custom-property references with static fallbacks, so they respond to govuk-frontend's runtime theming.`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const swatchStyle = (colour: string): React.CSSProperties => ({
  display: 'inline-block',
  width: 40,
  height: 40,
  background: colour,
  border: '1px solid rgba(11, 12, 12, 0.15)',
  verticalAlign: 'middle',
  marginRight: 10,
});

export const ColourPalette: Story = {
  render: () => (
    <table className="govuk-table">
      <caption className="govuk-table__caption govuk-table__caption--m">
        Colour palette (govuk-colour)
      </caption>
      <tbody className="govuk-table__body">
        {Object.entries(palette).map(([name, variants]) => (
          <tr key={name} className="govuk-table__row">
            <th scope="row" className="govuk-table__header">
              {name}
            </th>
            <td className="govuk-table__cell">
              {Object.entries(variants).map(([variant, value]) => (
                <span key={variant} style={{ display: 'inline-block', marginRight: 20 }}>
                  <span style={swatchStyle(value)} />
                  <code>
                    {variant}: {value}
                  </code>
                </span>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const FunctionalColours: Story = {
  render: () => (
    <table className="govuk-table">
      <caption className="govuk-table__caption govuk-table__caption--m">
        Functional colours (govuk-functional-colour)
      </caption>
      <tbody className="govuk-table__body">
        {Object.entries(functionalColours).map(([name, value]) => (
          <tr key={name} className="govuk-table__row">
            <th scope="row" className="govuk-table__header">
              {name}
            </th>
            <td className="govuk-table__cell">
              <span style={swatchStyle(value)} />
              <code>{value}</code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const Spacing: Story = {
  render: () => (
    <table className="govuk-table">
      <caption className="govuk-table__caption govuk-table__caption--m">
        Spacing scale (govuk-spacing)
      </caption>
      <tbody className="govuk-table__body">
        {Object.entries(spacingPoints).map(([point, px]) => (
          <tr key={point} className="govuk-table__row">
            <th scope="row" className="govuk-table__header">
              {point}
            </th>
            <td className="govuk-table__cell">
              <code>{px}px</code>
            </td>
            <td className="govuk-table__cell" style={{ width: '100%' }}>
              <span style={{ display: 'inline-block', height: 16, width: px, background: '#1d70b8' }} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const Typography: Story = {
  render: () => (
    <div>
      {Object.entries(typographyScale)
        .reverse()
        .map(([size]) => (
          <p key={size} className={`govuk-body govuk-!-font-size-${size}`}>
            govuk-!-font-size-{size} — The quick brown fox
          </p>
        ))}
    </div>
  ),
};

export const Breakpoints: Story = {
  render: () => (
    <table className="govuk-table">
      <caption className="govuk-table__caption govuk-table__caption--m">Breakpoints</caption>
      <tbody className="govuk-table__body">
        {Object.entries(breakpoints).map(([name, px]) => (
          <tr key={name} className="govuk-table__row">
            <th scope="row" className="govuk-table__header">
              {name}
            </th>
            <td className="govuk-table__cell">
              <code>{px}px</code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};
