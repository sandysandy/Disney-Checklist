import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { TaskList } from './TaskList';

describe('TaskList', () => {
  it('renders linked tasks with the with-link modifier', () => {
    const { container } = render(
      <TaskList
        idPrefix="tasks"
        items={[{ title: 'Company Directors', href: '/directors', status: { text: 'Completed' } }]}
      />,
    );
    expect(container.querySelector('ul')).toHaveClass('govuk-task-list');
    const item = container.querySelector('li.govuk-task-list__item');
    expect(item).toHaveClass('govuk-task-list__item--with-link');
    const link = screen.getByRole('link', { name: /Company Directors/ });
    expect(link).toHaveClass('govuk-link', 'govuk-task-list__link');
    expect(link).toHaveAttribute('href', '/directors');
    expect(link.parentElement).toHaveClass('govuk-task-list__name-and-hint');
  });

  it('describes the link by its status', () => {
    render(
      <TaskList
        idPrefix="tasks"
        items={[{ title: 'Company Directors', href: '#', status: { text: 'Completed' } }]}
      />,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-describedby', 'tasks-1-status');
    expect(link).toHaveAccessibleDescription('Completed');
    const status = document.getElementById('tasks-1-status');
    expect(status).toHaveClass('govuk-task-list__status');
  });

  it('describes the link by its hint then status when a hint is present', () => {
    render(
      <TaskList
        idPrefix="tasks"
        items={[
          {
            title: 'Business plan',
            href: '#',
            hint: 'Covers objectives and forecasts',
            status: { text: 'Completed' },
          },
        ]}
      />,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-describedby', 'tasks-1-hint tasks-1-status');
    expect(link).toHaveAccessibleDescription('Covers objectives and forecasts Completed');
    expect(document.getElementById('tasks-1-hint')).toHaveClass('govuk-task-list__hint');
  });

  it('renders tag statuses with the Tag component', () => {
    render(
      <TaskList
        idPrefix="tasks"
        items={[
          {
            title: 'Documentation',
            href: '#',
            status: { tag: { colour: 'blue', children: 'In progress' } },
          },
        ]}
      />,
    );
    const tag = screen.getByText('In progress');
    expect(tag.tagName).toBe('STRONG');
    expect(tag).toHaveClass('govuk-tag', 'govuk-tag--blue');
    expect(tag.parentElement).toHaveAttribute('id', 'tasks-1-status');
  });

  it('renders non-linked tasks without a link and without the modifier', () => {
    const { container } = render(
      <TaskList
        idPrefix="tasks"
        items={[
          {
            title: 'Payment',
            hint: 'It will cost between £15 and £75',
            status: { text: 'Cannot start yet', cannotStartYet: true },
          },
        ]}
      />,
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(container.querySelector('li')).not.toHaveClass('govuk-task-list__item--with-link');
    expect(screen.getByText('Payment').tagName).toBe('DIV');
  });

  it('greys out statuses that cannot start yet', () => {
    render(
      <TaskList
        idPrefix="tasks"
        items={[{ title: 'Payment', status: { text: 'Cannot start yet', cannotStartYet: true } }]}
      />,
    );
    expect(screen.getByText('Cannot start yet')).toHaveClass(
      'govuk-task-list__status',
      'govuk-task-list__status--cannot-start-yet',
    );
  });

  it('numbers hint and status ids per item from the id prefix', () => {
    render(
      <TaskList
        idPrefix="tasks"
        items={[
          { title: 'One', href: '#', status: { text: 'Completed' } },
          { title: 'Two', href: '#', hint: 'A hint', status: { text: 'Completed' } },
        ]}
      />,
    );
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('aria-describedby', 'tasks-1-status');
    expect(links[1]).toHaveAttribute('aria-describedby', 'tasks-2-hint tasks-2-status');
  });

  it('generates a unique id prefix when none is given', () => {
    render(<TaskList items={[{ title: 'One', href: '#', status: { text: 'Completed' } }]} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAccessibleDescription('Completed');
    expect(link.getAttribute('aria-describedby')).toMatch(/-1-status$/);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <TaskList
        idPrefix="tasks"
        items={[
          { title: 'Company Directors', href: '#', status: { text: 'Completed' } },
          {
            title: 'Business plan',
            href: '#',
            hint: 'Covers objectives and forecasts',
            status: { tag: { colour: 'blue', children: 'In progress' } },
          },
          {
            title: 'Payment',
            status: { text: 'Cannot start yet', cannotStartYet: true },
          },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
