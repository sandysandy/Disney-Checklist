import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CharacterCount } from './CharacterCount';

function getVisibleStatus(container: HTMLElement) {
  return container.querySelector('.govuk-character-count__status');
}

function getSrStatus(container: HTMLElement) {
  return container.querySelector('.govuk-character-count__sr-status');
}

describe('CharacterCount', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the textarea described by the limit message', () => {
    const { container } = render(
      <CharacterCount label="Can you provide more detail?" name="more-detail" maxLength={200} />,
    );
    const textarea = screen.getByLabelText('Can you provide more detail?');
    expect(textarea).toHaveClass('govuk-textarea');
    expect(textarea).toHaveAttribute('rows', '5');
    const infoId = (textarea.getAttribute('aria-describedby') ?? '').split(' ')[0];
    const info = document.getElementById(infoId);
    expect(info).toHaveTextContent('You can enter up to 200 characters');
    expect(info).toHaveClass('govuk-visually-hidden');
    expect(getVisibleStatus(container)).toHaveTextContent('You have 200 characters remaining');
  });

  it('wires hint and error after the count message in aria-describedby', () => {
    render(
      <CharacterCount
        label="More detail"
        name="more-detail"
        maxLength={10}
        hint="Do not include personal information"
        errorMessage="Enter more detail"
      />,
    );
    const textarea = screen.getByLabelText('More detail');
    const [infoId, hintId, errorId] = (textarea.getAttribute('aria-describedby') ?? '').split(' ');
    expect(document.getElementById(infoId)).toHaveTextContent('You can enter up to 10 characters');
    expect(document.getElementById(hintId)).toHaveTextContent(
      'Do not include personal information',
    );
    expect(document.getElementById(errorId)).toHaveTextContent('Error: Enter more detail');
    expect(textarea).toHaveClass('govuk-textarea--error');
  });

  it('updates the visible count message on every keystroke', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CharacterCount label="More detail" name="more-detail" maxLength={10} />,
    );
    const textarea = screen.getByLabelText('More detail');
    await user.type(textarea, 'Hello');
    expect(getVisibleStatus(container)).toHaveTextContent('You have 5 characters remaining');
    await user.type(textarea, '!');
    expect(getVisibleStatus(container)).toHaveTextContent('You have 4 characters remaining');
  });

  it('uses singular, at-limit and over-limit messages', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CharacterCount label="More detail" name="more-detail" maxLength={3} />,
    );
    const textarea = screen.getByLabelText('More detail');
    await user.type(textarea, 'ab');
    expect(getVisibleStatus(container)).toHaveTextContent('You have 1 character remaining');
    await user.type(textarea, 'c');
    expect(getVisibleStatus(container)).toHaveTextContent('You have 0 characters remaining');
    await user.type(textarea, 'd');
    expect(getVisibleStatus(container)).toHaveTextContent('You have 1 character too many');
    await user.type(textarea, 'e');
    expect(getVisibleStatus(container)).toHaveTextContent('You have 2 characters too many');
  });

  it('applies error styling to the message and the textarea when over the limit', () => {
    const { container } = render(
      <CharacterCount
        label="More detail"
        name="more-detail"
        maxLength={10}
        defaultValue="More than ten characters"
      />,
    );
    expect(getVisibleStatus(container)).toHaveClass('govuk-error-message');
    expect(getVisibleStatus(container)).not.toHaveClass('govuk-hint');
    expect(screen.getByLabelText('More detail')).toHaveClass('govuk-textarea--error');
  });

  it('counts words when maxWords is set', () => {
    const { container } = render(
      <CharacterCount
        label="Job description"
        name="job-description"
        maxWords={3}
        defaultValue="one two three four"
      />,
    );
    expect(getVisibleStatus(container)).toHaveTextContent('You have 1 word too many');
    const textarea = screen.getByLabelText('Job description');
    const infoId = (textarea.getAttribute('aria-describedby') ?? '').split(' ')[0];
    expect(document.getElementById(infoId)).toHaveTextContent('You can enter up to 3 words');
  });

  it('hides the count message until the threshold is reached', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CharacterCount
        label="More detail"
        name="more-detail"
        maxLength={10}
        threshold={80}
        defaultValue="1234567"
      />,
    );
    expect(getVisibleStatus(container)).toHaveClass('govuk-character-count__message--disabled');
    expect(getSrStatus(container)).toHaveAttribute('aria-hidden', 'true');

    await user.type(screen.getByLabelText('More detail'), '8');
    expect(getVisibleStatus(container)).not.toHaveClass('govuk-character-count__message--disabled');
    expect(getSrStatus(container)).not.toHaveAttribute('aria-hidden');
  });

  it('updates the screen reader status at most once per second while typing pauses', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'Date'] });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { container } = render(
      <CharacterCount label="More detail" name="more-detail" maxLength={10} />,
    );
    const textarea = screen.getByLabelText('More detail');
    const srStatus = getSrStatus(container);
    expect(srStatus).toHaveAttribute('aria-live', 'polite');
    expect(srStatus).toHaveTextContent('You have 10 characters remaining');

    await user.click(textarea);
    await user.type(textarea, 'Hello');
    // The visible message updates immediately…
    expect(getVisibleStatus(container)).toHaveTextContent('You have 5 characters remaining');
    // …but the polite live region waits for the debounced checker.
    expect(srStatus).toHaveTextContent('You have 10 characters remaining');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500);
    });
    expect(srStatus).toHaveTextContent('You have 5 characters remaining');
  });

  it('stops checking for changes on blur', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'Date'] });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { container } = render(
      <CharacterCount label="More detail" name="more-detail" maxLength={10} />,
    );
    const textarea = screen.getByLabelText('More detail');
    await user.type(textarea, 'Hello');
    await user.tab();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });
    expect(getSrStatus(container)).toHaveTextContent('You have 10 characters remaining');
  });

  it('supports custom i18n messages', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CharacterCount
        label="Manylion"
        name="more-detail"
        maxLength={5}
        textareaDescriptionText="Gallwch nodi hyd at %{count} o nodau"
        charactersUnderLimitText={{
          one: 'Mae gennych %{count} nod ar ôl',
          other: 'Mae gennych %{count} o nodau ar ôl',
        }}
        charactersAtLimitText="Mae gennych 0 o nodau ar ôl"
      />,
    );
    expect(getVisibleStatus(container)).toHaveTextContent('Mae gennych 5 o nodau ar ôl');
    await user.type(screen.getByLabelText('Manylion'), 'abcd');
    expect(getVisibleStatus(container)).toHaveTextContent('Mae gennych 1 nod ar ôl');
    await user.type(screen.getByLabelText('Manylion'), 'e');
    expect(getVisibleStatus(container)).toHaveTextContent('Mae gennych 0 o nodau ar ôl');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <CharacterCount
        label="Can you provide more detail?"
        name="more-detail"
        maxLength={200}
        hint="Do not include personal information"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
