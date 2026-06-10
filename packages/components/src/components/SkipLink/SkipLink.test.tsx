import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { SkipLink } from './SkipLink';

describe('SkipLink', () => {
  it('renders defaults: href "#content" and "Skip to main content" text', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link', { name: 'Skip to main content' });
    expect(link).toHaveAttribute('href', '#content');
    expect(link).toHaveClass('govuk-skip-link');
    expect(link).toHaveAttribute('data-module', 'govuk-skip-link');
  });

  it('focuses the target, adding a temporary tabindex and the focused class', async () => {
    const user = userEvent.setup();
    render(
      <>
        <SkipLink />
        <main id="content">Main content</main>
      </>,
    );
    const main = screen.getByRole('main');
    expect(main).not.toHaveAttribute('tabindex');

    await user.click(screen.getByRole('link', { name: 'Skip to main content' }));

    expect(main).toHaveFocus();
    expect(main).toHaveAttribute('tabindex', '-1');
    expect(main).toHaveClass('govuk-skip-link-focused-element');
  });

  it('removes the temporary tabindex and class on blur', async () => {
    const user = userEvent.setup();
    render(
      <>
        <SkipLink />
        <main id="content">Main content</main>
        <button type="button">Elsewhere</button>
      </>,
    );
    await user.click(screen.getByRole('link', { name: 'Skip to main content' }));
    const main = screen.getByRole('main');
    expect(main).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Elsewhere' }));

    expect(main).not.toHaveAttribute('tabindex');
    expect(main).not.toHaveClass('govuk-skip-link-focused-element');
  });

  it('keeps an existing tabindex on the target after blur', async () => {
    const user = userEvent.setup();
    render(
      <>
        <SkipLink />
        <main id="content" tabIndex={0}>
          Main content
        </main>
        <button type="button">Elsewhere</button>
      </>,
    );
    await user.click(screen.getByRole('link', { name: 'Skip to main content' }));
    await user.click(screen.getByRole('button', { name: 'Elsewhere' }));
    expect(screen.getByRole('main')).toHaveAttribute('tabindex', '0');
  });

  it('does nothing when the target is missing', async () => {
    const user = userEvent.setup();
    render(<SkipLink href="#missing" />);
    await expect(
      user.click(screen.getByRole('link', { name: 'Skip to main content' })),
    ).resolves.not.toThrow();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <>
        <SkipLink />
        <main id="content">Main content</main>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
