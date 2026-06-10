import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Radios } from './Radios';

const items = [
  { value: 'england', label: 'England' },
  { value: 'scotland', label: 'Scotland' },
];

describe('Radios', () => {
  it('renders a fieldset with the legend and radio inputs', () => {
    render(<Radios name="where-do-you-live" legend="Where do you live?" items={items} />);
    const group = screen.getByRole('group', { name: 'Where do you live?' });
    expect(group).toHaveClass('govuk-fieldset');
    expect(screen.getByLabelText('England')).toHaveClass('govuk-radios__input');
    expect(screen.getByLabelText('Scotland')).toHaveAttribute('type', 'radio');
  });

  it('wires hint and error into the fieldset aria-describedby', () => {
    render(
      <Radios
        name="where-do-you-live"
        legend="Where do you live?"
        hint="Select one option"
        errorMessage="Select where you live"
        items={items}
      />,
    );
    const group = screen.getByRole('group');
    const describedBy = group.getAttribute('aria-describedby') ?? '';
    const [hintId, errorId] = describedBy.split(' ');
    expect(document.getElementById(hintId)).toHaveTextContent('Select one option');
    expect(document.getElementById(errorId)).toHaveTextContent('Error: Select where you live');
    expect(group.closest('.govuk-form-group')).toHaveClass('govuk-form-group--error');
  });

  it('renders divider items', () => {
    const { container } = render(
      <Radios
        name="where-do-you-live"
        legend="Where do you live?"
        items={[...items, { divider: 'or' }, { value: 'abroad', label: 'Abroad' }]}
      />,
    );
    expect(container.querySelector('.govuk-radios__divider')).toHaveTextContent('or');
  });

  it('applies small and inline variant classes', () => {
    const { container } = render(
      <Radios name="filter" legend="Filter" items={items} small inline />,
    );
    const radios = container.querySelector('.govuk-radios');
    expect(radios).toHaveClass('govuk-radios--small');
    expect(radios).toHaveClass('govuk-radios--inline');
  });

  it('associates item hints with their inputs', () => {
    render(
      <Radios
        name="sign-in"
        legend="How do you want to sign in?"
        items={[{ value: 'gateway', label: 'Government Gateway', hint: 'You’ll have a user ID' }]}
      />,
    );
    const input = screen.getByLabelText('Government Gateway');
    const hintId = input.getAttribute('aria-describedby') ?? '';
    expect(document.getElementById(hintId)).toHaveTextContent('You’ll have a user ID');
  });

  it('toggles conditional reveals with aria-expanded as radios are checked', async () => {
    const user = userEvent.setup();
    render(
      <Radios
        name="contact"
        legend="How would you prefer to be contacted?"
        items={[
          { value: 'email', label: 'Email', conditional: <span>Email address</span> },
          { value: 'phone', label: 'Phone', conditional: <span>Phone number</span> },
        ]}
      />,
    );
    const email = screen.getByLabelText('Email');
    const phone = screen.getByLabelText('Phone');
    const emailReveal = document.getElementById(email.getAttribute('aria-controls') ?? '');
    const phoneReveal = document.getElementById(phone.getAttribute('aria-controls') ?? '');

    expect(email).toHaveAttribute('aria-expanded', 'false');
    expect(emailReveal).toHaveClass('govuk-radios__conditional--hidden');

    await user.click(email);
    expect(email).toHaveAttribute('aria-expanded', 'true');
    expect(emailReveal).not.toHaveClass('govuk-radios__conditional--hidden');
    expect(phoneReveal).toHaveClass('govuk-radios__conditional--hidden');

    await user.click(phone);
    expect(email).toHaveAttribute('aria-expanded', 'false');
    expect(emailReveal).toHaveClass('govuk-radios__conditional--hidden');
    expect(phone).toHaveAttribute('aria-expanded', 'true');
    expect(phoneReveal).not.toHaveClass('govuk-radios__conditional--hidden');
  });

  it('supports uncontrolled usage with defaultValue', async () => {
    const user = userEvent.setup();
    render(
      <Radios
        name="where-do-you-live"
        legend="Where do you live?"
        items={items}
        defaultValue="england"
      />,
    );
    expect(screen.getByLabelText('England')).toBeChecked();
    await user.click(screen.getByLabelText('Scotland'));
    expect(screen.getByLabelText('Scotland')).toBeChecked();
    expect(screen.getByLabelText('England')).not.toBeChecked();
  });

  it('supports controlled usage with value and onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <Radios
        name="where-do-you-live"
        legend="Where do you live?"
        items={items}
        value="england"
        onChange={onChange}
      />,
    );
    await user.click(screen.getByLabelText('Scotland'));
    expect(onChange).toHaveBeenCalledWith('scotland', expect.anything());
    // Controlled: stays on the value prop until re-rendered.
    expect(screen.getByLabelText('England')).toBeChecked();
    rerender(
      <Radios
        name="where-do-you-live"
        legend="Where do you live?"
        items={items}
        value="scotland"
        onChange={onChange}
      />,
    );
    expect(screen.getByLabelText('Scotland')).toBeChecked();
  });

  it('disables items', () => {
    render(
      <Radios
        name="where-do-you-live"
        legend="Where do you live?"
        items={[items[0], { ...items[1], disabled: true }]}
      />,
    );
    expect(screen.getByLabelText('Scotland')).toBeDisabled();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Radios
        name="contact"
        legend="How would you prefer to be contacted?"
        hint="Select one option"
        errorMessage="Select how you want to be contacted"
        items={[
          { value: 'email', label: 'Email', conditional: <span>Email address</span> },
          { value: 'phone', label: 'Phone', hint: 'We only call during office hours' },
        ]}
      />,
    );
    // govuk-frontend deliberately sets aria-expanded on inputs with
    // conditional reveals, which axe's aria-allowed-attr rule rejects.
    expect(
      await axe(container, { rules: { 'aria-allowed-attr': { enabled: false } } }),
    ).toHaveNoViolations();
  });
});
