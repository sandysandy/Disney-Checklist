import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { NotificationBanner } from './NotificationBanner';

describe('NotificationBanner', () => {
  it('renders a region labelled "Important" by default', () => {
    render(<NotificationBanner>Content</NotificationBanner>);
    const banner = screen.getByRole('region', { name: 'Important' });
    expect(banner).toHaveClass('govuk-notification-banner');
    expect(banner).not.toHaveClass('govuk-notification-banner--success');
    expect(banner).toHaveAttribute('data-module', 'govuk-notification-banner');
    expect(banner).toHaveAttribute('aria-labelledby', 'govuk-notification-banner-title');
  });

  it('does not focus the default banner on mount', () => {
    render(<NotificationBanner>Content</NotificationBanner>);
    const banner = screen.getByRole('region', { name: 'Important' });
    expect(banner).not.toHaveFocus();
    expect(banner).not.toHaveAttribute('tabindex');
  });

  it('renders the success variant as an alert titled "Success"', () => {
    render(<NotificationBanner type="success">Content</NotificationBanner>);
    const banner = screen.getByRole('alert');
    expect(banner).toHaveClass('govuk-notification-banner--success');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Success');
  });

  it('focuses the success banner on mount with tabindex="-1"', () => {
    render(<NotificationBanner type="success">Content</NotificationBanner>);
    const banner = screen.getByRole('alert');
    expect(banner).toHaveAttribute('tabindex', '-1');
    expect(banner).toHaveFocus();
  });

  it('does not focus the success banner when disableAutoFocus is set', () => {
    render(
      <NotificationBanner type="success" disableAutoFocus>
        Content
      </NotificationBanner>,
    );
    const banner = screen.getByRole('alert');
    expect(banner).not.toHaveFocus();
    expect(banner).not.toHaveAttribute('tabindex');
  });

  it('supports a custom title, heading level and title id', () => {
    render(
      <NotificationBanner titleText="Action required" titleHeadingLevel={3} titleId="my-title">
        Content
      </NotificationBanner>,
    );
    const heading = screen.getByRole('heading', { level: 3, name: 'Action required' });
    expect(heading).toHaveAttribute('id', 'my-title');
    expect(screen.getByRole('region', { name: 'Action required' })).toHaveAttribute(
      'aria-labelledby',
      'my-title',
    );
  });

  it('wraps plain string content in the heading paragraph', () => {
    render(<NotificationBanner>There may be a delay.</NotificationBanner>);
    expect(screen.getByText('There may be a delay.')).toHaveClass(
      'govuk-notification-banner__heading',
    );
  });

  it('respects an explicit role override', () => {
    render(
      <NotificationBanner type="success" role="region">
        Content
      </NotificationBanner>,
    );
    const banner = screen.getByRole('region', { name: 'Success' });
    expect(banner).not.toHaveFocus();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <NotificationBanner type="success">Training outcome recorded</NotificationBanner>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
