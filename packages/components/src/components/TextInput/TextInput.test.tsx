import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { TextInput } from './TextInput';

describe('TextInput', () => {
  it('associates the label with the input', () => {
    render(<TextInput label="Event name" name="event-name" />);
    const input = screen.getByLabelText('Event name');
    expect(input).toHaveClass('govuk-input');
  });

  it('wires hint and error into aria-describedby', () => {
    render(
      <TextInput
        label="Event name"
        name="event-name"
        hint="Some hint"
        errorMessage="Enter a name"
      />,
    );
    const input = screen.getByLabelText('Event name');
    const describedBy = input.getAttribute('aria-describedby') ?? '';
    expect(document.getElementById(describedBy.split(' ')[0])).toHaveTextContent('Some hint');
    expect(document.getElementById(describedBy.split(' ')[1])).toHaveTextContent(
      'Error: Enter a name',
    );
    expect(input).toHaveClass('govuk-input--error');
  });

  it('marks the form group as errored', () => {
    const { container } = render(
      <TextInput label="Event name" name="event-name" errorMessage="Enter a name" />,
    );
    expect(container.querySelector('.govuk-form-group')).toHaveClass('govuk-form-group--error');
  });

  it('renders prefix and suffix hidden from assistive tech', () => {
    const { container } = render(
      <TextInput label="Cost" name="cost" prefix="£" suffix="per item" />,
    );
    const prefix = container.querySelector('.govuk-input__prefix');
    expect(prefix).toHaveTextContent('£');
    expect(prefix).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('.govuk-input__suffix')).toHaveTextContent('per item');
  });

  it('renders the label as a page heading when requested', () => {
    render(<TextInput label="Event name" name="event-name" labelIsPageHeading labelSize="l" />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('govuk-label-wrapper');
  });

  it('applies width classes', () => {
    render(<TextInput label="NI number" name="nino" width="10" />);
    expect(screen.getByLabelText('NI number')).toHaveClass('govuk-input--width-10');
  });

  it('has no axe violations with hint and error', async () => {
    const { container } = render(
      <TextInput label="Event name" name="event-name" hint="Hint" errorMessage="Enter a name" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
