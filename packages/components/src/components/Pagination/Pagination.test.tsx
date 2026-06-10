import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders a navigation landmark labelled "Pagination"', () => {
    render(<Pagination items={[{ number: 1, href: '#', current: true }]} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toHaveClass('govuk-pagination');
  });

  it('renders page links with "Page n" labels and aria-current on the current page', () => {
    render(
      <Pagination
        items={[
          { number: 1, href: '/page/1' },
          { number: 2, href: '/page/2', current: true },
        ]}
      />,
    );
    const page1 = screen.getByRole('link', { name: 'Page 1' });
    expect(page1).toHaveAttribute('href', '/page/1');
    expect(page1).not.toHaveAttribute('aria-current');
    const page2 = screen.getByRole('link', { name: 'Page 2' });
    expect(page2).toHaveAttribute('aria-current', 'page');
    expect(page2.closest('li')).toHaveClass('govuk-pagination__item--current');
  });

  it('renders ellipsis items without a link', () => {
    const { container } = render(
      <Pagination
        items={[{ number: 1, href: '#' }, { ellipsis: true }, { number: 9, href: '#' }]}
      />,
    );
    const ellipsis = container.querySelector('.govuk-pagination__item--ellipsis');
    expect(ellipsis).toHaveTextContent('⋯');
    expect(ellipsis?.querySelector('a')).toBeNull();
  });

  it('renders previous and next links with default hidden "page" text and rel attributes', () => {
    const { container } = render(
      <Pagination
        previous={{ href: '/page/1' }}
        next={{ href: '/page/3' }}
        items={[{ number: 2, href: '#', current: true }]}
      />,
    );
    const prev = screen.getByRole('link', { name: 'Previous page' });
    expect(prev).toHaveAttribute('rel', 'prev');
    expect(prev.closest('div')).toHaveClass('govuk-pagination__prev');
    const next = screen.getByRole('link', { name: 'Next page' });
    expect(next).toHaveAttribute('rel', 'next');
    // Numbered pagination: prev arrow before the text, next arrow after it.
    expect(container.querySelectorAll('.govuk-pagination__icon')).toHaveLength(2);
  });

  it('uses block-level layout when only previous/next are given', () => {
    render(
      <Pagination
        previous={{ href: '#', labelText: 'Applying for a licence' }}
        next={{ href: '#', labelText: 'Driver CPC part 1 test' }}
      />,
    );
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('govuk-pagination--block');
    expect(
      screen.getByRole('link', { name: 'Previous page : Applying for a licence' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Driver CPC part 1 test')).toHaveClass('govuk-pagination__link-label');
  });

  it('decorates block-level link titles without labels', () => {
    render(<Pagination previous={{ href: '#' }} />);
    expect(screen.getByText(/Previous/).closest('span')).toHaveClass(
      'govuk-pagination__link-title--decorated',
    );
  });

  it('prefers visuallyHiddenText over the default page label', () => {
    render(<Pagination items={[{ number: 6, href: '#', visuallyHiddenText: 'Page six' }]} />);
    expect(screen.getByRole('link', { name: 'Page six' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Pagination
        previous={{ href: '#' }}
        next={{ href: '#' }}
        items={[
          { number: 1, href: '#' },
          { number: 2, href: '#', current: true },
          { number: 3, href: '#' },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
