import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders the OGL logo and licence text by default', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('.govuk-footer__licence-logo')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(container.querySelector('.govuk-footer__licence-description')).toHaveTextContent(
      'All content is available under the Open Government Licence v3.0, except where otherwise stated',
    );
    expect(screen.getByRole('link', { name: 'Open Government Licence v3.0' })).toHaveAttribute(
      'href',
      'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
    );
  });

  it('renders the Crown copyright link with the crest class', () => {
    render(<Footer />);
    const copyright = screen.getByRole('link', { name: '© Crown copyright' });
    expect(copyright).toHaveClass('govuk-footer__copyright-logo');
    expect(copyright.getAttribute('href')).toContain('crown-copyright');
  });

  it('renders the crown SVG', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('svg.govuk-footer__crown')).toHaveAttribute(
      'viewBox',
      '0 0 64 60',
    );
  });

  it('renders meta links with a visually hidden heading', () => {
    render(
      <Footer
        metaItems={[
          { children: 'Help', href: '/help' },
          { children: 'Cookies', href: '/cookies' },
        ]}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Support links' })).toHaveClass(
      'govuk-visually-hidden',
    );
    const help = screen.getByRole('link', { name: 'Help' });
    expect(help).toHaveClass('govuk-footer__link');
    expect(help.closest('li')).toHaveClass('govuk-footer__inline-list-item');
  });

  it('renders custom meta content', () => {
    render(<Footer metaContent="Built by the Government Digital Service" />);
    expect(screen.getByText('Built by the Government Digital Service')).toHaveClass(
      'govuk-footer__meta-custom',
    );
  });

  it('renders navigation sections as columns of links', () => {
    const { container } = render(
      <Footer
        navigation={[
          {
            title: 'Services',
            width: 'two-thirds',
            columns: 2,
            items: [
              { children: 'Benefits', href: '/benefits' },
              { children: 'Justice', href: '/justice' },
            ],
          },
          {
            title: 'Departments',
            width: 'one-third',
            items: [{ children: 'Worldwide', href: '/world' }],
          },
        ]}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Services' })).toHaveClass('govuk-footer__heading');
    const sections = container.querySelectorAll('.govuk-footer__section');
    expect(sections[0]).toHaveClass('govuk-grid-column-two-thirds');
    expect(sections[0].querySelector('ul')).toHaveClass('govuk-footer__list--columns-2');
    expect(sections[1]).toHaveClass('govuk-grid-column-one-third');
    expect(container.querySelector('.govuk-footer__section-break')).toBeInTheDocument();
  });

  it('overrides the content licence and copyright', () => {
    render(<Footer contentLicence="Custom licence" copyright="© Custom copyright" />);
    expect(screen.getByText('Custom licence')).toHaveClass('govuk-footer__licence-description');
    expect(screen.getByRole('link', { name: '© Custom copyright' })).toBeInTheDocument();
  });

  it('removes the licence block when contentLicence is null', () => {
    const { container } = render(<Footer contentLicence={null} />);
    expect(container.querySelector('.govuk-footer__licence-logo')).toBeNull();
    expect(container.querySelector('.govuk-footer__licence-description')).toBeNull();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Footer
        navigation={[{ title: 'Services', items: [{ children: 'Benefits', href: '/benefits' }] }]}
        metaItems={[{ children: 'Help', href: '/help' }]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
