import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { CookieBanner, CookieBannerMessage } from './CookieBanner';

describe('CookieBanner', () => {
  it('renders a labelled region with data-nosnippet', () => {
    render(
      <CookieBanner>
        <CookieBannerMessage heading="Cookies on this service">We use cookies.</CookieBannerMessage>
      </CookieBanner>,
    );
    const region = screen.getByRole('region', { name: 'Cookie banner' });
    expect(region).toHaveClass('govuk-cookie-banner');
    expect(region).toHaveAttribute('data-nosnippet');
  });

  it('wraps string content in a govuk-body paragraph', () => {
    render(
      <CookieBanner>
        <CookieBannerMessage>We use cookies.</CookieBannerMessage>
      </CookieBanner>,
    );
    const paragraph = screen.getByText('We use cookies.');
    expect(paragraph.tagName).toBe('P');
    expect(paragraph).toHaveClass('govuk-body');
  });

  it('renders heading and actions in the right structure', () => {
    render(
      <CookieBanner>
        <CookieBannerMessage
          heading="Cookies on this service"
          actions={<button type="button">Accept</button>}
        >
          We use cookies.
        </CookieBannerMessage>
      </CookieBanner>,
    );
    const heading = screen.getByRole('heading', { level: 2, name: 'Cookies on this service' });
    expect(heading).toHaveClass('govuk-cookie-banner__heading');
    expect(screen.getByRole('button', { name: 'Accept' }).parentElement).toHaveClass(
      'govuk-button-group',
    );
  });

  it('supports role=alert confirmation messages', () => {
    render(
      <CookieBanner>
        <CookieBannerMessage role="alert">You’ve accepted analytics cookies.</CookieBannerMessage>
      </CookieBanner>,
    );
    expect(screen.getByRole('alert')).toHaveClass('govuk-cookie-banner__message');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <CookieBanner>
        <CookieBannerMessage
          heading="Cookies on this service"
          actions={<button type="button">Accept</button>}
        >
          We use cookies.
        </CookieBannerMessage>
      </CookieBanner>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
