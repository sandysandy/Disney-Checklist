import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { DateInput } from './DateInput';

describe('DateInput', () => {
  it('renders a fieldset with role group and three numeric text inputs', () => {
    render(<DateInput legend="When was your passport issued?" namePrefix="passport-issued" />);
    const group = screen.getByRole('group', { name: 'When was your passport issued?' });
    expect(group).toHaveClass('govuk-fieldset');
    const day = screen.getByLabelText('Day');
    const month = screen.getByLabelText('Month');
    const year = screen.getByLabelText('Year');
    expect(day).toHaveAttribute('type', 'text');
    expect(day).toHaveAttribute('inputmode', 'numeric');
    expect(day).toHaveClass('govuk-input--width-2');
    expect(month).toHaveClass('govuk-input--width-2');
    expect(year).toHaveClass('govuk-input--width-4');
  });

  it('prefixes field names with namePrefix', () => {
    render(<DateInput legend="Passport issued" namePrefix="passport-issued" />);
    expect(screen.getByLabelText('Day')).toHaveAttribute('name', 'passport-issued-day');
    expect(screen.getByLabelText('Month')).toHaveAttribute('name', 'passport-issued-month');
    expect(screen.getByLabelText('Year')).toHaveAttribute('name', 'passport-issued-year');
  });

  it('wires hint and error into the fieldset aria-describedby', () => {
    render(
      <DateInput
        legend="Passport issued"
        id="passport-issued"
        hint="For example, 27 3 2007"
        errorMessage="Enter the date your passport was issued"
      />,
    );
    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('aria-describedby', 'passport-issued-hint passport-issued-error');
    expect(document.getElementById('passport-issued-hint')).toHaveTextContent(
      'For example, 27 3 2007',
    );
    expect(document.getElementById('passport-issued-error')).toHaveTextContent(
      'Error: Enter the date your passport was issued',
    );
    expect(group.closest('.govuk-form-group')).toHaveClass('govuk-form-group--error');
  });

  it('highlights every field when there is an error and no errorFields', () => {
    render(<DateInput legend="Passport issued" errorMessage="Enter the date" />);
    expect(screen.getByLabelText('Day')).toHaveClass('govuk-input--error');
    expect(screen.getByLabelText('Month')).toHaveClass('govuk-input--error');
    expect(screen.getByLabelText('Year')).toHaveClass('govuk-input--error');
  });

  it('highlights only the fields listed in errorFields', () => {
    render(
      <DateInput
        legend="Passport issued"
        errorMessage="Must include a year"
        errorFields={['year']}
      />,
    );
    expect(screen.getByLabelText('Day')).not.toHaveClass('govuk-input--error');
    expect(screen.getByLabelText('Month')).not.toHaveClass('govuk-input--error');
    expect(screen.getByLabelText('Year')).toHaveClass('govuk-input--error');
  });

  it('calls onChange with all field values and supports uncontrolled typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DateInput
        legend="Passport issued"
        defaultValues={{ day: '6', month: '3' }}
        onChange={onChange}
      />,
    );
    expect(screen.getByLabelText('Day')).toHaveValue('6');
    await user.type(screen.getByLabelText('Year'), '2007');
    expect(screen.getByLabelText('Year')).toHaveValue('2007');
    expect(onChange).toHaveBeenLastCalledWith(
      { day: '6', month: '3', year: '2007' },
      expect.anything(),
    );
  });

  it('supports controlled usage with values', () => {
    const { rerender } = render(
      <DateInput legend="Passport issued" values={{ day: '6', month: '3', year: '2007' }} />,
    );
    expect(screen.getByLabelText('Month')).toHaveValue('3');
    rerender(
      <DateInput legend="Passport issued" values={{ day: '6', month: '4', year: '2007' }} />,
    );
    expect(screen.getByLabelText('Month')).toHaveValue('4');
  });

  it('applies autocomplete attributes per field', () => {
    render(
      <DateInput
        legend="Date of birth"
        autocomplete={{ day: 'bday-day', month: 'bday-month', year: 'bday-year' }}
      />,
    );
    expect(screen.getByLabelText('Day')).toHaveAttribute('autocomplete', 'bday-day');
    expect(screen.getByLabelText('Year')).toHaveAttribute('autocomplete', 'bday-year');
  });

  it('has no axe violations with hint and error', async () => {
    const { container } = render(
      <DateInput
        legend="When was your passport issued?"
        hint="For example, 27 3 2007"
        errorMessage="Enter the date your passport was issued"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
