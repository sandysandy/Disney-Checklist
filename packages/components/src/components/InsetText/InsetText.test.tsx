import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { InsetText } from './InsetText';

describe('InsetText', () => {
  it('renders a div with the govuk-inset-text class', () => {
    render(<InsetText>It can take up to 8 weeks to register.</InsetText>);
    const inset = screen.getByText('It can take up to 8 weeks to register.');
    expect(inset.tagName).toBe('DIV');
    expect(inset).toHaveClass('govuk-inset-text');
  });

  it('merges a custom className and spreads rest props', () => {
    render(
      <InsetText className="extra" data-testid="inset">
        Content
      </InsetText>,
    );
    expect(screen.getByTestId('inset')).toHaveClass('govuk-inset-text', 'extra');
  });

  it('has no axe violations', async () => {
    const { container } = render(<InsetText>Content</InsetText>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
