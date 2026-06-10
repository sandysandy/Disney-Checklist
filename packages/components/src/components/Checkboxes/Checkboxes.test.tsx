import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Checkboxes } from './Checkboxes';

const items = [
  { value: 'carcasses', label: 'Waste from animal carcasses' },
  { value: 'mines', label: 'Waste from mines or quarries' },
  { value: 'farm', label: 'Farm or agricultural waste' },
];

describe('Checkboxes', () => {
  it('renders a fieldset with the legend and checkbox inputs', () => {
    render(
      <Checkboxes name="waste" legend="Which types of waste do you transport?" items={items} />,
    );
    const group = screen.getByRole('group', { name: 'Which types of waste do you transport?' });
    expect(group).toHaveClass('govuk-fieldset');
    const input = screen.getByLabelText('Waste from animal carcasses');
    expect(input).toHaveClass('govuk-checkboxes__input');
    expect(input).toHaveAttribute('type', 'checkbox');
  });

  it('wires hint and error into the fieldset aria-describedby', () => {
    render(
      <Checkboxes
        name="waste"
        legend="Which types of waste do you transport?"
        hint="Select all that apply"
        errorMessage="Select the types of waste you transport"
        items={items}
      />,
    );
    const group = screen.getByRole('group');
    const describedBy = group.getAttribute('aria-describedby') ?? '';
    const [hintId, errorId] = describedBy.split(' ');
    expect(document.getElementById(hintId)).toHaveTextContent('Select all that apply');
    expect(document.getElementById(errorId)).toHaveTextContent(
      'Error: Select the types of waste you transport',
    );
    expect(group.closest('.govuk-form-group')).toHaveClass('govuk-form-group--error');
  });

  it('allows selecting multiple options', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkboxes name="waste" legend="Waste" items={items} onChange={onChange} />);
    await user.click(screen.getByLabelText('Waste from animal carcasses'));
    await user.click(screen.getByLabelText('Farm or agricultural waste'));
    expect(screen.getByLabelText('Waste from animal carcasses')).toBeChecked();
    expect(screen.getByLabelText('Farm or agricultural waste')).toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith(['carcasses', 'farm'], expect.anything());
  });

  it('renders a divider item', () => {
    const { container } = render(
      <Checkboxes
        name="countries"
        legend="Countries"
        items={[...items, { divider: 'or' }, { value: 'none', label: 'None', exclusive: true }]}
      />,
    );
    expect(container.querySelector('.govuk-checkboxes__divider')).toHaveTextContent('or');
  });

  it('unchecks other options when an exclusive option is checked, and vice versa', async () => {
    const user = userEvent.setup();
    render(
      <Checkboxes
        name="countries"
        legend="Will you be travelling to any of these countries?"
        items={[
          { value: 'france', label: 'France' },
          { value: 'spain', label: 'Spain' },
          { divider: 'or' },
          { value: 'none', label: 'None of the above', exclusive: true },
        ]}
      />,
    );
    const france = screen.getByLabelText('France');
    const spain = screen.getByLabelText('Spain');
    const none = screen.getByLabelText('None of the above');
    expect(none).toHaveAttribute('data-behaviour', 'exclusive');

    await user.click(france);
    await user.click(spain);
    await user.click(none);
    expect(none).toBeChecked();
    expect(france).not.toBeChecked();
    expect(spain).not.toBeChecked();

    await user.click(france);
    expect(france).toBeChecked();
    expect(none).not.toBeChecked();
  });

  it('toggles conditional reveals with aria-expanded as checkboxes are toggled', async () => {
    const user = userEvent.setup();
    render(
      <Checkboxes
        name="contact"
        legend="How would you like to be contacted?"
        items={[{ value: 'email', label: 'Email', conditional: <span>Email address</span> }]}
      />,
    );
    const email = screen.getByLabelText('Email');
    const reveal = document.getElementById(email.getAttribute('aria-controls') ?? '');
    expect(email).toHaveAttribute('aria-expanded', 'false');
    expect(reveal).toHaveClass('govuk-checkboxes__conditional--hidden');

    await user.click(email);
    expect(email).toHaveAttribute('aria-expanded', 'true');
    expect(reveal).not.toHaveClass('govuk-checkboxes__conditional--hidden');

    await user.click(email);
    expect(email).toHaveAttribute('aria-expanded', 'false');
    expect(reveal).toHaveClass('govuk-checkboxes__conditional--hidden');
  });

  it('hides the conditional reveal of an exclusive option once it is unchecked', async () => {
    const user = userEvent.setup();
    render(
      <Checkboxes
        name="contact"
        legend="Contact"
        items={[
          { value: 'email', label: 'Email' },
          { value: 'none', label: 'None', exclusive: true, conditional: <span>Why not?</span> },
        ]}
      />,
    );
    const none = screen.getByLabelText('None');
    const reveal = document.getElementById(none.getAttribute('aria-controls') ?? '');
    await user.click(none);
    expect(reveal).not.toHaveClass('govuk-checkboxes__conditional--hidden');
    await user.click(screen.getByLabelText('Email'));
    expect(none).toHaveAttribute('aria-expanded', 'false');
    expect(reveal).toHaveClass('govuk-checkboxes__conditional--hidden');
  });

  it('supports uncontrolled usage with defaultValues', async () => {
    const user = userEvent.setup();
    render(<Checkboxes name="waste" legend="Waste" items={items} defaultValues={['mines']} />);
    expect(screen.getByLabelText('Waste from mines or quarries')).toBeChecked();
    await user.click(screen.getByLabelText('Waste from mines or quarries'));
    expect(screen.getByLabelText('Waste from mines or quarries')).not.toBeChecked();
  });

  it('supports controlled usage with values', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Checkboxes
        name="waste"
        legend="Waste"
        items={items}
        values={['farm']}
        onChange={onChange}
      />,
    );
    expect(screen.getByLabelText('Farm or agricultural waste')).toBeChecked();
    await user.click(screen.getByLabelText('Waste from animal carcasses'));
    expect(onChange).toHaveBeenCalledWith(['farm', 'carcasses'], expect.anything());
    // Controlled: stays as the values prop until re-rendered.
    expect(screen.getByLabelText('Waste from animal carcasses')).not.toBeChecked();
  });

  it('applies the small variant class', () => {
    const { container } = render(
      <Checkboxes name="organisation" legend="Organisation" items={items} small />,
    );
    expect(container.querySelector('.govuk-checkboxes')).toHaveClass('govuk-checkboxes--small');
  });

  it('describes single checkboxes without a fieldset using the group hint', () => {
    render(
      <Checkboxes
        name="declaration"
        hint="Read the terms first"
        items={[{ value: 'agree', label: 'I agree' }]}
      />,
    );
    const input = screen.getByLabelText('I agree');
    const describedBy = input.getAttribute('aria-describedby') ?? '';
    expect(document.getElementById(describedBy)).toHaveTextContent('Read the terms first');
    expect(screen.queryByRole('group')).not.toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Checkboxes
        name="nationality"
        legend="What is your nationality?"
        hint="Select all options that are relevant to you"
        errorMessage="Select your nationality"
        items={[
          {
            value: 'british',
            label: 'British',
            hint: 'including English, Scottish, Welsh and Northern Irish',
          },
          { value: 'irish', label: 'Irish' },
          { divider: 'or' },
          { value: 'none', label: 'None of the above', exclusive: true },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
