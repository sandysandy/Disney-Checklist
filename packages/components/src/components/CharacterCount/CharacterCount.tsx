import { forwardRef, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FocusEvent, ReactNode, Ref, TextareaHTMLAttributes } from 'react';
import { classNames } from '../../internal/classNames';
import { useOptionalId } from '../../internal/useId';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { FormGroup } from '../FormGroup/FormGroup';
import { Hint } from '../Hint/Hint';
import { Label } from '../Label/Label';

export interface CharacterCountPluralMessages {
  /** Message used when the count is exactly one; `%{count}` is replaced. */
  one: string;
  /** Message used for any other count; `%{count}` is replaced. */
  other: string;
}

export interface CharacterCountProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'children' | 'maxLength'
> {
  /** The question or label for the textarea. */
  label: ReactNode;
  /** Size modifier for the label, matching the GOV.UK heading scale. */
  labelSize?: 's' | 'm' | 'l' | 'xl';
  /** Render the label inside an `<h1>` when the question is the page heading. */
  labelIsPageHeading?: boolean;
  /** Hint text displayed between the label and the textarea. */
  hint?: ReactNode;
  /** When set, renders the error message and applies error styling. */
  errorMessage?: ReactNode;
  /** The maximum number of characters. Ignored when `maxWords` is set. */
  maxLength?: number;
  /** The maximum number of words. Takes precedence over `maxLength`. */
  maxWords?: number;
  /**
   * Percentage of the limit that has to be reached before the count message
   * is shown. The message is hidden (visually and from assistive technology)
   * below the threshold.
   */
  threshold?: number;
  /**
   * Fallback description of the limit, shown when JavaScript is unavailable
   * in govuk-frontend and used as the accessible description of the textarea.
   * `%{count}` is replaced with the limit.
   */
  textareaDescriptionText?: string;
  /** Count message when under the character limit. */
  charactersUnderLimitText?: CharacterCountPluralMessages;
  /** Count message when exactly at the character limit. */
  charactersAtLimitText?: string;
  /** Count message when over the character limit. */
  charactersOverLimitText?: CharacterCountPluralMessages;
  /** Count message when under the word limit. */
  wordsUnderLimitText?: CharacterCountPluralMessages;
  /** Count message when exactly at the word limit. */
  wordsAtLimitText?: string;
  /** Count message when over the word limit. */
  wordsOverLimitText?: CharacterCountPluralMessages;
  /** Extra ids to append to the textarea's `aria-describedby`. */
  describedBy?: string;
  /** Class name applied to the wrapping form group. */
  formGroupClassName?: string;
}

/**
 * GOV.UK Character count: a textarea that tells users how many characters or
 * words they have remaining, ported from the govuk-frontend character-count
 * behaviour. The visible count message updates on every keystroke while a
 * visually hidden `aria-live="polite"` status is updated at most once per
 * second (while the field is focused and typing has paused), so screen
 * readers are not flooded with announcements. Going over the limit applies
 * error styling to the message and the textarea.
 *
 * @see https://design-system.service.gov.uk/components/character-count/
 */
export const CharacterCount = forwardRef<HTMLTextAreaElement, CharacterCountProps>(
  function CharacterCount(
    {
      label,
      labelSize,
      labelIsPageHeading,
      hint,
      errorMessage,
      maxLength,
      maxWords,
      threshold,
      textareaDescriptionText,
      charactersUnderLimitText = {
        one: 'You have %{count} character remaining',
        other: 'You have %{count} characters remaining',
      },
      charactersAtLimitText = 'You have 0 characters remaining',
      charactersOverLimitText = {
        one: 'You have %{count} character too many',
        other: 'You have %{count} characters too many',
      },
      wordsUnderLimitText = {
        one: 'You have %{count} word remaining',
        other: 'You have %{count} words remaining',
      },
      wordsAtLimitText = 'You have 0 words remaining',
      wordsOverLimitText = {
        one: 'You have %{count} word too many',
        other: 'You have %{count} words too many',
      },
      describedBy,
      formGroupClassName,
      id,
      name,
      rows = 5,
      className,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      ...rest
    },
    forwardedRef,
  ) {
    const textareaId = useOptionalId(id ?? name, 'govuk-character-count');
    const hintId = `${textareaId}-hint`;
    const errorId = `${textareaId}-error`;
    const infoId = `${textareaId}-info`;

    const isWords = maxWords != null;
    const limit = maxWords ?? maxLength ?? Infinity;

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const lastInputTimestamp = useRef<number | null>(null);
    const lastInputValue = useRef('');
    const valueChecker = useRef<number | null>(null);

    const [text, setText] = useState(() => String(value ?? defaultValue ?? ''));
    // The screen reader status lags behind the visible message: it is only
    // refreshed by the once-per-second checker, like govuk-frontend.
    const [srText, setSrText] = useState(() => String(value ?? defaultValue ?? ''));

    // Keep the count in sync when the textarea is controlled.
    useEffect(() => {
      if (value !== undefined) {
        setText(String(value));
      }
    }, [value]);

    // Stop the value checker if unmounted while focused.
    useEffect(() => {
      return () => {
        if (valueChecker.current !== null) {
          window.clearInterval(valueChecker.current);
        }
      };
    }, []);

    function countOf(content: string): number {
      if (isWords) {
        return (content.match(/\S+/g) ?? []).length;
      }
      return content.length;
    }

    function formatCountMessage(count: number): string {
      const remaining = limit - count;
      if (remaining === 0) {
        return isWords ? wordsAtLimitText : charactersAtLimitText;
      }
      const displayNumber = Math.abs(remaining);
      const messages = isWords
        ? remaining < 0
          ? wordsOverLimitText
          : wordsUnderLimitText
        : remaining < 0
          ? charactersOverLimitText
          : charactersUnderLimitText;
      return (displayNumber === 1 ? messages.one : messages.other).replace(
        '%{count}',
        String(displayNumber),
      );
    }

    function updateIfValueChanged() {
      const $textarea = textareaRef.current;
      if (!$textarea) {
        return;
      }
      if ($textarea.value !== lastInputValue.current) {
        lastInputValue.current = $textarea.value;
        setText($textarea.value);
        setSrText($textarea.value);
      }
    }

    function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
      setText(event.target.value);
      lastInputTimestamp.current = Date.now();
      onChange?.(event);
    }

    function handleFocus(event: FocusEvent<HTMLTextAreaElement>) {
      // While focused, refresh the screen reader status at most once per
      // second, and only once typing has paused for 500ms.
      valueChecker.current = window.setInterval(() => {
        if (!lastInputTimestamp.current || Date.now() - 500 >= lastInputTimestamp.current) {
          updateIfValueChanged();
        }
      }, 1000);
      onFocus?.(event);
    }

    function handleBlur(event: FocusEvent<HTMLTextAreaElement>) {
      if (valueChecker.current !== null) {
        window.clearInterval(valueChecker.current);
        valueChecker.current = null;
      }
      onBlur?.(event);
    }

    const setRefs = (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as { current: HTMLTextAreaElement | null }).current = node;
      }
    };

    const count = countOf(text);
    const isOverLimit = limit - count < 0;
    const isOverThreshold =
      threshold == null || threshold === 0 ? true : (limit * threshold) / 100 <= count;

    const description = (
      textareaDescriptionText ?? `You can enter up to %{count} ${isWords ? 'words' : 'characters'}`
    ).replace('%{count}', String(limit));

    const ariaDescribedBy =
      classNames(infoId, describedBy, hint != null && hintId, errorMessage != null && errorId) ||
      undefined;

    return (
      <FormGroup
        hasError={errorMessage != null}
        className={classNames('govuk-character-count', formGroupClassName)}
        data-module="govuk-character-count"
        data-maxlength={isWords ? undefined : maxLength}
        data-maxwords={maxWords}
        data-threshold={threshold}
      >
        <Label htmlFor={textareaId} size={labelSize} isPageHeading={labelIsPageHeading}>
          {label}
        </Label>
        {hint != null && <Hint id={hintId}>{hint}</Hint>}
        {errorMessage != null && <ErrorMessage id={errorId}>{errorMessage}</ErrorMessage>}
        <textarea
          {...rest}
          ref={setRefs as Ref<HTMLTextAreaElement>}
          id={textareaId}
          name={name}
          rows={rows}
          className={classNames(
            'govuk-textarea',
            (errorMessage != null || isOverLimit) && 'govuk-textarea--error',
            'govuk-js-character-count',
            className,
          )}
          aria-describedby={ariaDescribedBy}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <div
          id={infoId}
          className="govuk-hint govuk-character-count__message govuk-visually-hidden"
        >
          {description}
        </div>
        <div
          className={classNames(
            isOverLimit ? 'govuk-error-message' : 'govuk-hint',
            'govuk-character-count__message',
            'govuk-character-count__status',
            !isOverThreshold && 'govuk-character-count__message--disabled',
          )}
          aria-hidden="true"
        >
          {formatCountMessage(count)}
        </div>
        <div
          className="govuk-character-count__sr-status govuk-visually-hidden"
          aria-live="polite"
          aria-hidden={isOverThreshold ? undefined : true}
        >
          {formatCountMessage(countOf(srText))}
        </div>
      </FormGroup>
    );
  },
);
