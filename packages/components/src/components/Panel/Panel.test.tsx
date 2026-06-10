import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Panel } from './Panel';

describe('Panel', () => {
  it('renders the confirmation panel with title and body', () => {
    const { container } = render(<Panel title="Application complete">Your reference number</Panel>);
    const panel = container.querySelector('.govuk-panel');
    expect(panel).toHaveClass('govuk-panel--confirmation');
    expect(screen.getByRole('heading', { level: 1, name: 'Application complete' })).toHaveClass(
      'govuk-panel__title',
    );
    expect(container.querySelector('.govuk-panel__body')).toHaveTextContent(
      'Your reference number',
    );
  });

  it('omits the body when there are no children', () => {
    const { container } = render(<Panel title="Application complete" />);
    expect(container.querySelector('.govuk-panel__body')).not.toBeInTheDocument();
  });

  it('supports a custom heading level', () => {
    render(
      <Panel title="Application complete" headingLevel={2}>
        Body
      </Panel>,
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Application complete');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Panel title="Application complete">Reference: HDJ2123F</Panel>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
