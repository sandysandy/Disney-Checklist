import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { SummaryCard, SummaryList } from './SummaryList';

describe('SummaryList', () => {
  it('renders rows as a definition list', () => {
    const { container } = render(<SummaryList rows={[{ key: 'Name', value: 'Sarah Philips' }]} />);
    const dl = container.querySelector('dl');
    expect(dl).toHaveClass('govuk-summary-list');
    const row = dl?.querySelector('.govuk-summary-list__row');
    expect(row?.querySelector('dt.govuk-summary-list__key')).toHaveTextContent('Name');
    expect(row?.querySelector('dd.govuk-summary-list__value')).toHaveTextContent('Sarah Philips');
    expect(row?.querySelector('.govuk-summary-list__actions')).not.toBeInTheDocument();
  });

  it('renders a single action as a plain link with visually hidden text', () => {
    render(
      <SummaryList
        rows={[
          {
            key: 'Name',
            value: 'Sarah Philips',
            actions: [{ href: '/change-name', children: 'Change', visuallyHiddenText: 'name' }],
          },
        ]}
      />,
    );
    const link = screen.getByRole('link', { name: 'Change name' });
    expect(link).toHaveAttribute('href', '/change-name');
    expect(link).toHaveClass('govuk-link');
    expect(link.querySelector('.govuk-visually-hidden')).toHaveTextContent('name');
    expect(link.closest('ul')).toBeNull();
  });

  it('renders multiple actions as a list', () => {
    const { container } = render(
      <SummaryList
        rows={[
          {
            key: 'Licence',
            value: 'For personal use',
            actions: [
              { href: '#change', children: 'Change' },
              { href: '#remove', children: 'Remove' },
            ],
          },
        ]}
      />,
    );
    const list = container.querySelector('ul.govuk-summary-list__actions-list');
    expect(list).toBeInTheDocument();
    expect(list?.querySelectorAll('li.govuk-summary-list__actions-list-item')).toHaveLength(2);
  });

  it('marks rows without actions when other rows have them', () => {
    const { container } = render(
      <SummaryList
        rows={[
          {
            key: 'Name',
            value: 'Sarah Philips',
            actions: [{ href: '#', children: 'Change' }],
          },
          { key: 'Date of birth', value: '5 January 1978' },
        ]}
      />,
    );
    const rows = container.querySelectorAll('.govuk-summary-list__row');
    expect(rows[0]).not.toHaveClass('govuk-summary-list__row--no-actions');
    expect(rows[1]).toHaveClass('govuk-summary-list__row--no-actions');
  });

  it('does not mark any row when no rows have actions', () => {
    const { container } = render(
      <SummaryList
        rows={[
          { key: 'Name', value: 'Sarah Philips' },
          { key: 'Date of birth', value: '5 January 1978' },
        ]}
      />,
    );
    container.querySelectorAll('.govuk-summary-list__row').forEach((row) => {
      expect(row).not.toHaveClass('govuk-summary-list__row--no-actions');
    });
  });

  it('applies the no-border variant', () => {
    const { container } = render(<SummaryList rows={[{ key: 'Name', value: 'Sarah' }]} noBorder />);
    expect(container.querySelector('dl')).toHaveClass(
      'govuk-summary-list',
      'govuk-summary-list--no-border',
    );
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <SummaryList
        rows={[
          {
            key: 'Name',
            value: 'Sarah Philips',
            actions: [{ href: '#', children: 'Change', visuallyHiddenText: 'name' }],
          },
          { key: 'Date of birth', value: '5 January 1978' },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('SummaryCard', () => {
  it('renders the card structure with title and content', () => {
    const { container } = render(
      <SummaryCard title="University of Gloucestershire">
        <SummaryList rows={[{ key: 'Course', value: 'English (3DMD)' }]} />
      </SummaryCard>,
    );
    const card = container.querySelector('.govuk-summary-card');
    expect(card).toBeInTheDocument();
    const title = screen.getByRole('heading', { level: 2, name: 'University of Gloucestershire' });
    expect(title).toHaveClass('govuk-summary-card__title');
    expect(title.parentElement).toHaveClass('govuk-summary-card__title-wrapper');
    expect(
      card?.querySelector('.govuk-summary-card__content dl.govuk-summary-list'),
    ).toBeInTheDocument();
  });

  it('supports a custom heading level', () => {
    render(
      <SummaryCard title="Card title" headingLevel={3}>
        <p>Content</p>
      </SummaryCard>,
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Card title' })).toBeInTheDocument();
  });

  it('renders a single card action in a div and multiple in a list', () => {
    const { container, rerender } = render(
      <SummaryCard title="Card" actions={[{ href: '#', children: 'Delete' }]}>
        <p>Content</p>
      </SummaryCard>,
    );
    expect(container.querySelector('div.govuk-summary-card__actions')).toBeInTheDocument();

    rerender(
      <SummaryCard
        title="Card"
        actions={[
          { href: '#', children: 'Delete' },
          { href: '#', children: 'Withdraw' },
        ]}
      >
        <p>Content</p>
      </SummaryCard>,
    );
    const list = container.querySelector('ul.govuk-summary-card__actions');
    expect(list).toBeInTheDocument();
    expect(list?.querySelectorAll('li.govuk-summary-card__action')).toHaveLength(2);
  });

  it('appends the card title to action links inside and on the card', () => {
    render(
      <SummaryCard
        title="University of Gloucestershire"
        actions={[{ href: '#', children: 'Delete choice', visuallyHiddenText: 'of' }]}
      >
        <SummaryList
          rows={[
            {
              key: 'Course',
              value: 'English (3DMD)',
              actions: [{ href: '#', children: 'Change', visuallyHiddenText: 'course' }],
            },
          ]}
        />
      </SummaryCard>,
    );
    expect(
      screen.getByRole('link', { name: 'Delete choice of (University of Gloucestershire)' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Change course (University of Gloucestershire)' }),
    ).toBeInTheDocument();
  });

  it('does not append a card title to summary lists outside a card', () => {
    render(
      <SummaryList
        rows={[
          {
            key: 'Name',
            value: 'Sarah',
            actions: [{ href: '#', children: 'Change', visuallyHiddenText: 'name' }],
          },
        ]}
      />,
    );
    expect(screen.getByRole('link', { name: 'Change name' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <SummaryCard
        title="University of Gloucestershire"
        actions={[
          { href: '#', children: 'Delete choice', visuallyHiddenText: 'of' },
          { href: '#', children: 'Withdraw', visuallyHiddenText: 'from' },
        ]}
      >
        <SummaryList
          rows={[
            {
              key: 'Course',
              value: 'English (3DMD)',
              actions: [{ href: '#', children: 'Change', visuallyHiddenText: 'course' }],
            },
          ]}
        />
      </SummaryCard>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
