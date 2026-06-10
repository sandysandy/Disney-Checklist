import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Breadcrumbs } from './Breadcrumbs';

const items = [
  { children: 'Home', href: '/' },
  { children: 'Travel abroad', href: '/travel-abroad' },
  { children: 'Passports' },
];

describe('Breadcrumbs', () => {
  it('renders a navigation landmark labelled "Breadcrumb"', () => {
    render(<Breadcrumbs items={items} />);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav).toHaveClass('govuk-breadcrumbs');
  });

  it('renders linked items as anchors within list items', () => {
    render(<Breadcrumbs items={items} />);
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveClass('govuk-breadcrumbs__link');
    expect(link).toHaveAttribute('href', '/');
    expect(link.closest('li')).toHaveClass('govuk-breadcrumbs__list-item');
  });

  it('marks the item without an href as the current page', () => {
    render(<Breadcrumbs items={items} />);
    const listItems = screen.getAllByRole('listitem');
    const current = listItems[listItems.length - 1];
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).toHaveTextContent('Passports');
    expect(current.querySelector('a')).toBeNull();
  });

  it('applies the collapse on mobile modifier', () => {
    render(<Breadcrumbs items={items} collapseOnMobile />);
    expect(screen.getByRole('navigation')).toHaveClass('govuk-breadcrumbs--collapse-on-mobile');
  });

  it('applies the inverse modifier', () => {
    render(<Breadcrumbs items={items} inverse />);
    expect(screen.getByRole('navigation')).toHaveClass('govuk-breadcrumbs--inverse');
  });

  it('supports a custom aria-label', () => {
    render(<Breadcrumbs items={items} aria-label="Hierarchy" />);
    expect(screen.getByRole('navigation', { name: 'Hierarchy' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Breadcrumbs items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
