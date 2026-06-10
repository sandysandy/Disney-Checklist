import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders a submit button with govuk classes by default', () => {
    render(<Button>Save and continue</Button>);
    const button = screen.getByRole('button', { name: 'Save and continue' });
    expect(button).toHaveClass('govuk-button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('data-module', 'govuk-button');
  });

  it('applies variant modifier classes', () => {
    render(<Button variant="warning">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('govuk-button--warning');
  });

  it('renders links as buttons with role and draggable=false', () => {
    render(<Button href="/start">Start now</Button>);
    const link = screen.getByRole('button', { name: 'Start now' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('draggable', 'false');
  });

  it('activates link buttons with the Space key', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    render(
      <Button href="/start" onClick={onClick}>
        Start now
      </Button>,
    );
    screen.getByRole('button').focus();
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('debounces clicks when preventDoubleClick is set', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button type="button" preventDoubleClick onClick={onClick}>
        Confirm
      </Button>,
    );
    await user.dblClick(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('sets aria-disabled on disabled buttons', () => {
    render(<Button disabled>Save</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Button>Save and continue</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
