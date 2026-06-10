import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { WarningText } from './WarningText';

describe('WarningText', () => {
  it('renders the warning message inside the govuk markup', () => {
    const { container } = render(
      <WarningText>You can be fined up to £5,000 if you do not register.</WarningText>,
    );
    expect(container.querySelector('.govuk-warning-text')).toBeInTheDocument();
    expect(container.querySelector('strong.govuk-warning-text__text')).toHaveTextContent(
      'You can be fined up to £5,000 if you do not register.',
    );
  });

  it('hides the "!" icon from assistive technology', () => {
    const { container } = render(<WarningText>Warning message</WarningText>);
    const icon = container.querySelector('.govuk-warning-text__icon');
    expect(icon).toHaveTextContent('!');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders a visually hidden "Warning" prefix by default', () => {
    render(<WarningText>Warning message</WarningText>);
    expect(screen.getByText('Warning')).toHaveClass('govuk-visually-hidden');
  });

  it('allows the icon fallback text to be customised', () => {
    render(<WarningText iconFallbackText="Danger">Warning message</WarningText>);
    expect(screen.getByText('Danger')).toHaveClass('govuk-visually-hidden');
    expect(screen.queryByText('Warning')).not.toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<WarningText>Warning message</WarningText>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
