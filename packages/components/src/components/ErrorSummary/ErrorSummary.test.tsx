import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ErrorSummary } from './ErrorSummary';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ErrorSummary', () => {
  it('renders the title, description and error links', () => {
    const { container } = render(
      <ErrorSummary
        description="The file could not be uploaded."
        errors={[{ targetId: 'file-upload', message: 'The CSV must be smaller than 2MB' }]}
      />,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'There is a problem' })).toHaveClass(
      'govuk-error-summary__title',
    );
    expect(screen.getByText('The file could not be uploaded.')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'The CSV must be smaller than 2MB' });
    expect(link).toHaveAttribute('href', '#file-upload');
    expect(container.querySelector('ul')).toHaveClass('govuk-list', 'govuk-error-summary__list');
  });

  it('keeps role="alert" on a child container, separate from the focus target', () => {
    const { container } = render(<ErrorSummary errors={[{ message: 'Error' }]} />);
    const root = container.querySelector('.govuk-error-summary');
    expect(root).toHaveAttribute('data-module', 'govuk-error-summary');
    expect(root).toHaveAttribute('tabindex', '-1');
    expect(root).not.toHaveAttribute('role');
    const alert = root?.firstElementChild;
    expect(alert).toHaveAttribute('role', 'alert');
  });

  it('moves focus to the summary on mount', () => {
    const { container } = render(<ErrorSummary errors={[{ message: 'Error' }]} />);
    expect(container.querySelector('.govuk-error-summary')).toHaveFocus();
  });

  it('does not move focus when disableAutoFocus is set', () => {
    const { container } = render(<ErrorSummary errors={[{ message: 'Error' }]} disableAutoFocus />);
    expect(container.querySelector('.govuk-error-summary')).not.toHaveFocus();
  });

  it('renders errors without a target as plain list items', () => {
    render(<ErrorSummary errors={[{ message: 'Accept the terms and conditions' }]} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Accept the terms and conditions')).toBeInTheDocument();
  });

  it('prefers an explicit href over targetId', () => {
    render(
      <ErrorSummary errors={[{ targetId: 'ignored', href: '#custom-target', message: 'Error' }]} />,
    );
    expect(screen.getByRole('link', { name: 'Error' })).toHaveAttribute('href', '#custom-target');
  });

  it('scrolls the label into view and focuses the input when a link is clicked', async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.spyOn(window.HTMLElement.prototype, 'scrollIntoView');
    render(
      <>
        <ErrorSummary errors={[{ targetId: 'full-name', message: 'Enter your full name' }]} />
        <label htmlFor="full-name">Full name</label>
        <input id="full-name" type="text" />
      </>,
    );
    await user.click(screen.getByRole('link', { name: 'Enter your full name' }));
    expect(screen.getByLabelText('Full name')).toHaveFocus();
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView.mock.contexts[0]).toBe(screen.getByText('Full name'));
  });

  it('scrolls the legend into view when the target is a radio in a fieldset', async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.spyOn(window.HTMLElement.prototype, 'scrollIntoView');
    render(
      <>
        <ErrorSummary errors={[{ targetId: 'where-do-you-live', message: 'Select a country' }]} />
        <fieldset>
          <legend>Where do you live?</legend>
          <label htmlFor="where-do-you-live">England</label>
          <input id="where-do-you-live" type="radio" name="where-do-you-live" />
        </fieldset>
      </>,
    );
    await user.click(screen.getByRole('link', { name: 'Select a country' }));
    expect(screen.getByLabelText('England')).toHaveFocus();
    expect(scrollIntoView.mock.contexts[0]).toBe(screen.getByText('Where do you live?'));
  });

  it('leaves focus alone when the link target does not exist', async () => {
    const user = userEvent.setup();
    render(<ErrorSummary errors={[{ targetId: 'missing', message: 'Error' }]} />);
    const link = screen.getByRole('link', { name: 'Error' });
    await user.click(link);
    expect(link).toHaveFocus();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <ErrorSummary
        description="Fix the following before continuing."
        errors={[
          { targetId: 'full-name', message: 'Enter your full name' },
          { message: 'Accept the terms and conditions' },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
