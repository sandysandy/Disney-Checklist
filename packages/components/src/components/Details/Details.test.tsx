import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Details } from './Details';

describe('Details', () => {
  it('renders native details and summary elements with govuk classes', () => {
    const { container } = render(<Details summary="Help with nationality">Detail text</Details>);
    const details = container.querySelector('details');
    expect(details).toHaveClass('govuk-details');
    const summary = container.querySelector('summary');
    expect(summary).toHaveClass('govuk-details__summary');
    expect(summary?.querySelector('.govuk-details__summary-text')).toHaveTextContent(
      'Help with nationality',
    );
    expect(container.querySelector('.govuk-details__text')).toHaveTextContent('Detail text');
  });

  it('is closed by default and supports the open attribute', () => {
    const { container, rerender } = render(<Details summary="Summary">Detail</Details>);
    expect(container.querySelector('details')).not.toHaveAttribute('open');
    rerender(
      <Details summary="Summary" open>
        Detail
      </Details>,
    );
    expect(container.querySelector('details')).toHaveAttribute('open');
  });

  it('toggles when the summary is clicked and fires onToggle', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const { container } = render(
      <Details summary="Help with nationality" onToggle={onToggle}>
        Detail text
      </Details>,
    );
    await user.click(screen.getByText('Help with nationality'));
    expect(container.querySelector('details')).toHaveAttribute('open');
    expect(onToggle).toHaveBeenCalled();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Details summary="Summary">Detail</Details>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
