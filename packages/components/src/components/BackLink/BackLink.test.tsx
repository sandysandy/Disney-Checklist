import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { BackLink } from './BackLink';

describe('BackLink', () => {
  it('renders with default text and href', () => {
    render(<BackLink />);
    const link = screen.getByRole('link', { name: 'Back' });
    expect(link).toHaveClass('govuk-back-link');
    expect(link).toHaveAttribute('href', '#');
  });

  it('renders custom text and href', () => {
    render(<BackLink href="/previous">Back to results</BackLink>);
    expect(screen.getByRole('link', { name: 'Back to results' })).toHaveAttribute(
      'href',
      '/previous',
    );
  });

  it('applies the inverse modifier class', () => {
    render(<BackLink inverse />);
    expect(screen.getByRole('link', { name: 'Back' })).toHaveClass('govuk-back-link--inverse');
  });

  it('has no axe violations', async () => {
    const { container } = render(<BackLink href="/previous" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
