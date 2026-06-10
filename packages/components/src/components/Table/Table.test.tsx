import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Table } from './Table';

const head = [
  { children: 'Month you apply' },
  { children: 'Rate for bicycles', format: 'numeric' as const },
];
const rows = [
  [{ children: 'January' }, { children: '£85', format: 'numeric' as const }],
  [{ children: 'February' }, { children: '£75', format: 'numeric' as const }],
];

describe('Table', () => {
  it('renders the govuk table structure', () => {
    const { container } = render(<Table caption="Monthly costs" head={head} rows={rows} />);

    const table = screen.getByRole('table', { name: 'Monthly costs' });
    expect(table).toHaveClass('govuk-table');
    expect(container.querySelector('caption')).toHaveClass('govuk-table__caption');
    expect(container.querySelector('thead')).toHaveClass('govuk-table__head');
    expect(container.querySelector('tbody')).toHaveClass('govuk-table__body');
    expect(container.querySelectorAll('tr')).toHaveLength(3);
    container.querySelectorAll('tr').forEach((row) => expect(row).toHaveClass('govuk-table__row'));
  });

  it('renders head cells as column headers with scope', () => {
    render(<Table head={head} rows={rows} />);
    const header = screen.getByRole('columnheader', { name: 'Month you apply' });
    expect(header).toHaveAttribute('scope', 'col');
    expect(header).toHaveClass('govuk-table__header');
  });

  it('applies the numeric format modifier to head and body cells', () => {
    render(<Table head={head} rows={rows} />);
    expect(screen.getByRole('columnheader', { name: 'Rate for bicycles' })).toHaveClass(
      'govuk-table__header--numeric',
    );
    expect(screen.getByRole('cell', { name: '£85' })).toHaveClass(
      'govuk-table__cell',
      'govuk-table__cell--numeric',
    );
  });

  it('applies caption size modifiers', () => {
    const { container } = render(<Table caption="Costs" captionSize="l" rows={rows} />);
    expect(container.querySelector('caption')).toHaveClass(
      'govuk-table__caption',
      'govuk-table__caption--l',
    );
  });

  it('renders the first cell of each row as a row header when firstCellIsHeader is set', () => {
    render(<Table head={head} rows={rows} firstCellIsHeader />);
    const rowHeader = screen.getByRole('rowheader', { name: 'January' });
    expect(rowHeader).toHaveAttribute('scope', 'row');
    expect(rowHeader).toHaveClass('govuk-table__header');
    expect(rowHeader.tagName).toBe('TH');
  });

  it('applies colSpan and rowSpan', () => {
    render(<Table rows={[[{ children: 'Spanning', colSpan: 2, rowSpan: 2 }], []]} />);
    const cell = screen.getByRole('cell', { name: 'Spanning' });
    expect(cell).toHaveAttribute('colspan', '2');
    expect(cell).toHaveAttribute('rowspan', '2');
  });

  it('applies the small text modifier', () => {
    render(<Table rows={rows} smallTextUntilTablet data-testid="table" />);
    expect(screen.getByTestId('table')).toHaveClass(
      'govuk-table',
      'govuk-table--small-text-until-tablet',
    );
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Table caption="Monthly costs" head={head} rows={rows} firstCellIsHeader />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
