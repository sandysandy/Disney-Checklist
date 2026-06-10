import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  it('links the GOV.UK logo to the homepage, defaulting to //gov.uk', () => {
    const { container } = render(<Header />);
    const link = container.querySelector('a.govuk-header__homepage-link');
    expect(link).toHaveAttribute('href', '//gov.uk');
    expect(container.querySelector('.govuk-header')).toBeInTheDocument();
  });

  it('renders the crown logo SVG with an accessible GOV.UK name', () => {
    render(<Header />);
    const logo = screen.getByRole('img', { name: 'GOV.UK' });
    expect(logo).toHaveClass('govuk-header__logotype');
    expect(logo).toHaveAttribute('focusable', 'false');
    expect(logo).toHaveAttribute('viewBox', '0 0 324 60');
  });

  it('supports a custom homepage URL', () => {
    const { container } = render(<Header homepageUrl="https://www.gov.uk" />);
    expect(container.querySelector('a.govuk-header__homepage-link')).toHaveAttribute(
      'href',
      'https://www.gov.uk',
    );
  });

  it('renders an optional product name', () => {
    render(<Header productName="Product" />);
    expect(screen.getByText('Product')).toHaveClass('govuk-header__product-name');
  });

  it('uses govuk-width-container by default and supports a custom container class', () => {
    const { container, rerender } = render(<Header />);
    expect(container.querySelector('.govuk-header__container')).toHaveClass(
      'govuk-width-container',
    );
    rerender(<Header containerClassName="govuk-header__container--full-width" />);
    expect(container.querySelector('.govuk-header__container')).toHaveClass(
      'govuk-header__container--full-width',
    );
    expect(container.querySelector('.govuk-header__container')).not.toHaveClass(
      'govuk-width-container',
    );
  });

  it('has no axe violations', async () => {
    const { container } = render(<Header productName="Product" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
