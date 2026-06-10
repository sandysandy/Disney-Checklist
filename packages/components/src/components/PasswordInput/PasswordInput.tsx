import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import { classNames } from '../../internal/classNames';
import { useOptionalId } from '../../internal/useId';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { FormGroup } from '../FormGroup/FormGroup';
import { Hint } from '../Hint/Hint';
import { Label } from '../Label/Label';

export interface PasswordInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'children' | 'type'
> {
  /** The question or label for the input, e.g. "Password". */
  label: ReactNode;
  /** Size modifier for the label, matching the GOV.UK heading scale. */
  labelSize?: 's' | 'm' | 'l' | 'xl';
  /** Render the label inside an `<h1>` when the question is the page heading. */
  labelIsPageHeading?: boolean;
  /** Hint text displayed between the label and the input. */
  hint?: ReactNode;
  /** When set, renders the error message and applies error styling. */
  errorMessage?: ReactNode;
  /** Extra ids to prepend to the input's `aria-describedby`. */
  describedBy?: string;
  /** Class name applied to the wrapping form group. */
  formGroupClassName?: string;
  /** Button text while the password is hidden. */
  showPasswordText?: string;
  /** Button text while the password is visible. */
  hidePasswordText?: string;
  /** Button `aria-label` while the password is hidden. */
  showPasswordAriaLabelText?: string;
  /** Button `aria-label` while the password is visible. */
  hidePasswordAriaLabelText?: string;
  /** Screen reader announcement made when the password becomes visible. */
  passwordShownAnnouncementText?: string;
  /** Screen reader announcement made when the password is hidden. */
  passwordHiddenAnnouncementText?: string;
}

/**
 * GOV.UK Password input, porting the govuk-frontend password-input behaviour:
 * a show/hide toggle button that switches the input between `password` and
 * `text`, a polite live region announcing the visibility change, and
 * automatic re-hiding when the surrounding form is submitted.
 *
 * @see https://design-system.service.gov.uk/components/password-input/
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      label,
      labelSize,
      labelIsPageHeading,
      hint,
      errorMessage,
      describedBy,
      formGroupClassName,
      showPasswordText = 'Show',
      hidePasswordText = 'Hide',
      showPasswordAriaLabelText = 'Show password',
      hidePasswordAriaLabelText = 'Hide password',
      passwordShownAnnouncementText = 'Your password is visible',
      passwordHiddenAnnouncementText = 'Your password is hidden',
      id,
      name,
      className,
      spellCheck = false,
      autoCapitalize = 'none',
      autoComplete = 'current-password',
      ...rest
    },
    forwardedRef,
  ) {
    const inputId = useOptionalId(id ?? name, 'govuk-password-input');
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;
    const ariaDescribedBy =
      classNames(describedBy, hint != null && hintId, errorMessage != null && errorId) || undefined;

    const inputRef = useRef<HTMLInputElement | null>(null);
    const visibleRef = useRef(false);
    const [visible, setVisible] = useState(false);
    // Empty until the first toggle, like govuk-frontend (the live region is
    // created empty and only populated when the type actually changes).
    const [announcement, setAnnouncement] = useState('');

    const setPasswordVisible = useCallback(
      (show: boolean) => {
        if (visibleRef.current === show) {
          return;
        }
        visibleRef.current = show;
        setVisible(show);
        setAnnouncement(show ? passwordShownAnnouncementText : passwordHiddenAnnouncementText);
      },
      [passwordShownAnnouncementText, passwordHiddenAnnouncementText],
    );

    // Revert the input to type="password" before the form is submitted.
    useEffect(() => {
      const $form = inputRef.current?.form;
      if (!$form) {
        return;
      }
      const handleSubmit = () => setPasswordVisible(false);
      $form.addEventListener('submit', handleSubmit);
      return () => $form.removeEventListener('submit', handleSubmit);
    }, [setPasswordVisible]);

    const setRefs = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as { current: HTMLInputElement | null }).current = node;
      }
    };

    return (
      <FormGroup
        hasError={errorMessage != null}
        className={classNames('govuk-password-input', formGroupClassName)}
        data-module="govuk-password-input"
      >
        <Label htmlFor={inputId} size={labelSize} isPageHeading={labelIsPageHeading}>
          {label}
        </Label>
        {hint != null && <Hint id={hintId}>{hint}</Hint>}
        {errorMessage != null && <ErrorMessage id={errorId}>{errorMessage}</ErrorMessage>}
        <div className="govuk-input__wrapper govuk-password-input__wrapper">
          <input
            {...rest}
            ref={setRefs as Ref<HTMLInputElement>}
            id={inputId}
            name={name}
            type={visible ? 'text' : 'password'}
            spellCheck={spellCheck}
            autoCapitalize={autoCapitalize}
            autoComplete={autoComplete}
            className={classNames(
              'govuk-input govuk-password-input__input govuk-js-password-input-input',
              errorMessage != null && 'govuk-input--error',
              className,
            )}
            aria-describedby={ariaDescribedBy}
          />
          <div className="govuk-password-input__sr-status govuk-visually-hidden" aria-live="polite">
            {announcement}
          </div>
          <button
            type="button"
            className="govuk-button govuk-button--secondary govuk-password-input__toggle govuk-js-password-input-toggle"
            data-module="govuk-button"
            aria-controls={inputId}
            aria-label={visible ? hidePasswordAriaLabelText : showPasswordAriaLabelText}
            onClick={() => setPasswordVisible(!visible)}
          >
            {visible ? hidePasswordText : showPasswordText}
          </button>
        </div>
      </FormGroup>
    );
  },
);
