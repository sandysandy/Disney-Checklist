import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { PhaseBanner } from './PhaseBanner';

describe('PhaseBanner', () => {
  it('renders the banner with tag and content', () => {
    const { container } = render(
      <PhaseBanner tag="Beta">
        This is a new service. <a href="#feedback">Give feedback</a>.
      </PhaseBanner>,
    );
    expect(container.querySelector('.govuk-phase-banner')).toBeInTheDocument();
    const content = container.querySelector('p.govuk-phase-banner__content');
    expect(content).toBeInTheDocument();
    expect(content?.querySelector('.govuk-phase-banner__text')).toHaveTextContent(
      'This is a new service.',
    );
    expect(screen.getByRole('link', { name: 'Give feedback' })).toBeInTheDocument();
  });

  it('renders the phase inside the Tag component with the banner tag class', () => {
    render(<PhaseBanner tag="Beta">Content</PhaseBanner>);
    const tag = screen.getByText('Beta');
    expect(tag.tagName).toBe('STRONG');
    expect(tag).toHaveClass('govuk-tag', 'govuk-phase-banner__content__tag');
  });

  it('supports a tag colour variant', () => {
    render(
      <PhaseBanner tag="Alpha" tagColour="purple">
        Content
      </PhaseBanner>,
    );
    expect(screen.getByText('Alpha')).toHaveClass('govuk-tag--purple');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <PhaseBanner tag="Beta">
        This is a new service. <a href="#feedback">Give feedback</a>.
      </PhaseBanner>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
