import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ExitThisPage } from './ExitThisPage';

afterEach(() => {
  document.body.classList.remove('govuk-exit-this-page-hide-content');
});

describe('ExitThisPage', () => {
  it('renders the warning button with the default text and redirect', () => {
    render(<ExitThisPage navigate={() => {}} />);
    const button = screen.getByRole('button', { name: 'Emergency Exit this page' });
    expect(button.tagName).toBe('A');
    expect(button).toHaveAttribute('href', 'https://www.bbc.co.uk/weather');
    expect(button).toHaveAttribute('rel', 'nofollow noreferrer');
    expect(button).toHaveClass('govuk-button--warning', 'govuk-exit-this-page__button');
  });

  it('exits on click: overlay alert, hidden content, navigation', async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();
    render(<ExitThisPage navigate={navigate} />);
    await user.click(screen.getByRole('button', { name: 'Emergency Exit this page' }));
    expect(navigate).toHaveBeenCalledWith('https://www.bbc.co.uk/weather');
    expect(screen.getByRole('alert')).toHaveTextContent('Loading.');
    expect(document.body).toHaveClass('govuk-exit-this-page-hide-content');
  });

  describe('Shift shortcut', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    function pressShift() {
      // The component listens for plain Shift keyups (shiftKey is false on release).
      act(() => {
        document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Shift', shiftKey: false }));
      });
    }

    it('announces progress and exits after three Shift presses', () => {
      const navigate = vi.fn();
      render(<ExitThisPage navigate={navigate} />);
      const status = document.querySelector('[role="status"]');

      pressShift();
      expect(status).toHaveTextContent('Shift, press 2 more times to exit.');
      pressShift();
      expect(status).toHaveTextContent('Shift, press 1 more time to exit.');
      pressShift();
      expect(navigate).toHaveBeenCalledTimes(1);
      expect(document.body).toHaveClass('govuk-exit-this-page-hide-content');
    });

    it('shows the keypress indicator lights as Shift is pressed', () => {
      render(<ExitThisPage navigate={() => {}} />);
      const indicator = document.querySelector('.govuk-exit-this-page__indicator');
      expect(indicator).not.toHaveClass('govuk-exit-this-page__indicator--visible');
      pressShift();
      expect(indicator).toHaveClass('govuk-exit-this-page__indicator--visible');
      expect(document.querySelectorAll('.govuk-exit-this-page__indicator-light--on')).toHaveLength(
        1,
      );
      pressShift();
      expect(document.querySelectorAll('.govuk-exit-this-page__indicator-light--on')).toHaveLength(
        2,
      );
    });

    it('times out after five seconds and announces the expiry', () => {
      const navigate = vi.fn();
      render(<ExitThisPage navigate={navigate} />);
      const status = document.querySelector('[role="status"]');

      pressShift();
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(status).toHaveTextContent('Exit this page expired.');

      // Counter restarts from zero after the timeout.
      pressShift();
      pressShift();
      expect(navigate).not.toHaveBeenCalled();
      pressShift();
      expect(navigate).toHaveBeenCalledTimes(1);
    });

    it('ignores Shift presses that are part of keyboard shortcuts', () => {
      const navigate = vi.fn();
      render(<ExitThisPage navigate={navigate} />);
      // Shift held while typing another key: keyup has shiftKey=true first.
      act(() => {
        document.dispatchEvent(new KeyboardEvent('keyup', { key: 'A', shiftKey: true }));
      });
      pressShift(); // lastKeyWasModified=true blocks this press
      pressShift();
      pressShift();
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  it('has no axe violations', async () => {
    const { container } = render(<ExitThisPage navigate={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
