import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';

const items = [
  { value: 'published', label: 'Recently published' },
  { value: 'updated', label: 'Recently updated' },
  { value: 'views', label: 'Most views' },
];

describe('Select', () => {
  it('associates the label with the select and renders options', () => {
    render(<Select label="Sort by" name="sort" items={items} />);
    const select = screen.getByLabelText('Sort by');
    expect(select).toHaveClass('govuk-select');
    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(screen.getByRole('option', { name: 'Most views' })).toHaveValue('views');
  });

  it('wires hint and error into aria-describedby', () => {
    render(
      <Select
        label="Choose location"
        name="location"
        hint="This can be different to where you went before"
        errorMessage="Select a location"
        items={items}
      />,
    );
    const select = screen.getByLabelText('Choose location');
    const describedBy = select.getAttribute('aria-describedby') ?? '';
    const [hintId, errorId] = describedBy.split(' ');
    expect(document.getElementById(hintId)).toHaveTextContent(
      'This can be different to where you went before',
    );
    expect(document.getElementById(errorId)).toHaveTextContent('Error: Select a location');
    expect(select).toHaveClass('govuk-select--error');
    expect(select.closest('.govuk-form-group')).toHaveClass('govuk-form-group--error');
  });

  it('supports selecting an option', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select label="Sort by" name="sort" items={items} onChange={onChange} />);
    await user.selectOptions(screen.getByLabelText('Sort by'), 'updated');
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByRole('option', { name: 'Recently updated' })).toHaveProperty(
      'selected',
      true,
    );
  });

  it('supports defaultValue and disabled options', () => {
    render(
      <Select
        label="Sort by"
        name="sort"
        defaultValue="views"
        items={[items[0], { ...items[1], disabled: true }, items[2]]}
      />,
    );
    expect(screen.getByRole('option', { name: 'Most views' })).toHaveProperty('selected', true);
    expect(screen.getByRole('option', { name: 'Recently updated' })).toBeDisabled();
  });

  it('applies the full width modifier', () => {
    render(<Select label="Sort by" name="sort" items={items} fullWidth />);
    expect(screen.getByLabelText('Sort by')).toHaveClass('govuk-!-width-full');
  });

  it('has no axe violations with hint and error', async () => {
    const { container } = render(
      <Select
        label="Sort by"
        name="sort"
        hint="Hint"
        errorMessage="Select an option"
        items={items}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
