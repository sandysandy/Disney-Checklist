import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders a strong element with the govuk-tag class', () => {
    render(<Tag>Completed</Tag>);
    const tag = screen.getByText('Completed');
    expect(tag.tagName).toBe('STRONG');
    expect(tag).toHaveClass('govuk-tag');
  });

  it('applies the colour modifier class', () => {
    render(<Tag colour="light-blue">In progress</Tag>);
    expect(screen.getByText('In progress')).toHaveClass('govuk-tag--light-blue');
  });

  it('does not add a modifier class without a colour', () => {
    render(<Tag>Completed</Tag>);
    expect(screen.getByText('Completed').className).toBe('govuk-tag');
  });

  it('merges a custom className', () => {
    render(<Tag className="extra">Completed</Tag>);
    expect(screen.getByText('Completed')).toHaveClass('govuk-tag', 'extra');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Tag colour="green">New</Tag>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
