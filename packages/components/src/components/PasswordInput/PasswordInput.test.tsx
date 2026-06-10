import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { PasswordInput } from './PasswordInput';

describe('PasswordInput', () => {
  it('renders a password input with secure defaults', () => {
    render(<PasswordInput label="Password" name="password" />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveAttribute('spellcheck', 'false');
    expect(input).toHaveAttribute('autocapitalize', 'none');
    expect(input).toHaveAttribute('autocomplete', 'current-password');
  });

  it('shows and hides the password with the toggle button', async () => {
    const user = userEvent.setup();
    render(<PasswordInput label="Password" name="password" />);
    const input = screen.getByLabelText('Password');
    const button = screen.getByRole('button', { name: 'Show password' });
    expect(button).toHaveAttribute('aria-controls', input.getAttribute('id'));

    await user.click(button);
    expect(input).toHaveAttribute('type', 'text');
    expect(button).toHaveTextContent('Hide');
    expect(button).toHaveAttribute('aria-label', 'Hide password');

    await user.click(button);
    expect(input).toHaveAttribute('type', 'password');
    expect(button).toHaveTextContent('Show');
    expect(button).toHaveAttribute('aria-label', 'Show password');
  });

  it('announces visibility changes in the live region', async () => {
    const user = userEvent.setup();
    const { container } = render(<PasswordInput label="Password" name="password" />);
    const status = container.querySelector('.govuk-password-input__sr-status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveTextContent('');

    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(status).toHaveTextContent('Your password is visible');

    await user.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(status).toHaveTextContent('Your password is hidden');
  });

  it('hides the password again when the form is submitted', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form onSubmit={(event) => event.preventDefault()}>
        <PasswordInput label="Password" name="password" />
      </form>,
    );
    const input = screen.getByLabelText('Password');
    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(input).toHaveAttribute('type', 'text');

    fireEvent.submit(container.querySelector('form') as HTMLFormElement);
    expect(input).toHaveAttribute('type', 'password');
    expect(container.querySelector('.govuk-password-input__sr-status')).toHaveTextContent(
      'Your password is hidden',
    );
  });

  it('supports custom i18n strings', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <PasswordInput
        label="Cyfrinair"
        name="password"
        showPasswordText="Datguddia"
        hidePasswordText="Cuddio"
        showPasswordAriaLabelText="Dangos cyfrinair"
        hidePasswordAriaLabelText="Cuddio cyfrinair"
        passwordShownAnnouncementText="Mae eich cyfrinair yn weladwy."
        passwordHiddenAnnouncementText="Mae eich cyfrinair wedi’i guddio."
      />,
    );
    const button = screen.getByRole('button', { name: 'Dangos cyfrinair' });
    expect(button).toHaveTextContent('Datguddia');
    await user.click(button);
    expect(button).toHaveTextContent('Cuddio');
    expect(container.querySelector('.govuk-password-input__sr-status')).toHaveTextContent(
      'Mae eich cyfrinair yn weladwy.',
    );
  });

  it('wires hint and error into aria-describedby', () => {
    render(
      <PasswordInput
        label="Password"
        name="password"
        hint="Must be at least 8 characters"
        errorMessage="Enter a password"
      />,
    );
    const input = screen.getByLabelText('Password');
    const describedBy = input.getAttribute('aria-describedby') ?? '';
    const [hintId, errorId] = describedBy.split(' ');
    expect(document.getElementById(hintId)).toHaveTextContent('Must be at least 8 characters');
    expect(document.getElementById(errorId)).toHaveTextContent('Error: Enter a password');
    expect(input).toHaveClass('govuk-input--error');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <PasswordInput
        label="Password"
        name="password"
        hint="Hint"
        errorMessage="Enter a password"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
