import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';
import { useOptionalId } from '../../internal/useId';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { FormGroup } from '../FormGroup/FormGroup';
import { Hint } from '../Hint/Hint';
import { Label } from '../Label/Label';

export type InputWidth =
  | 'full'
  | 'three-quarters'
  | 'two-thirds'
  | 'one-half'
  | 'one-third'
  | 'one-quarter'
  | '30'
  | '20'
  | '10'
  | '5'
  | '4'
  | '3'
  | '2';

export interface TextInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'children' | 'width' | 'prefix'
> {
  /** The question or label for the input. */
  label: ReactNode;
  /** Size modifier for the label, matching the GOV.UK heading scale. */
  labelSize?: 's' | 'm' | 'l' | 'xl';
  /** Render the label inside an `<h1>` when the question is the page heading. */
  labelIsPageHeading?: boolean;
  /** Hint text displayed between the label and the input. */
  hint?: ReactNode;
  /** When set, renders the error message and applies error styling. */
  errorMessage?: ReactNode;
  /** Width modifier: fluid fractions or fixed character widths. */
  width?: InputWidth;
  /** Prefix shown before the input, e.g. "£". */
  prefix?: ReactNode;
  /** Suffix shown after the input, e.g. "per item". */
  suffix?: ReactNode;
  /** Extra ids to append to the input's `aria-describedby`. */
  describedBy?: string;
  /** Class name applied to the wrapping form group. */
  formGroupClassName?: string;
}

const FIXED_WIDTHS = new Set(['30', '20', '10', '5', '4', '3', '2']);

/**
 * GOV.UK Text input, including label, hint, error message and prefix/suffix
 * composition with correct `aria-describedby` wiring.
 *
 * @see https://design-system.service.gov.uk/components/text-input/
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  {
    label,
    labelSize,
    labelIsPageHeading,
    hint,
    errorMessage,
    width,
    prefix,
    suffix,
    describedBy,
    formGroupClassName,
    id,
    name,
    type = 'text',
    className,
    ...rest
  },
  ref,
) {
  const inputId = useOptionalId(id ?? name, 'govuk-input');
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const ariaDescribedBy =
    classNames(describedBy, hint != null && hintId, errorMessage != null && errorId) || undefined;

  const input = (
    <input
      {...rest}
      ref={ref}
      id={inputId}
      name={name}
      type={type}
      className={classNames(
        'govuk-input',
        errorMessage != null && 'govuk-input--error',
        width != null &&
          (FIXED_WIDTHS.has(width) ? `govuk-input--width-${width}` : `govuk-!-width-${width}`),
        className,
      )}
      aria-describedby={ariaDescribedBy}
    />
  );

  return (
    <FormGroup hasError={errorMessage != null} className={formGroupClassName}>
      <Label htmlFor={inputId} size={labelSize} isPageHeading={labelIsPageHeading}>
        {label}
      </Label>
      {hint != null && <Hint id={hintId}>{hint}</Hint>}
      {errorMessage != null && <ErrorMessage id={errorId}>{errorMessage}</ErrorMessage>}
      {prefix != null || suffix != null ? (
        <div className="govuk-input__wrapper">
          {prefix != null && (
            <div className="govuk-input__prefix" aria-hidden="true">
              {prefix}
            </div>
          )}
          {input}
          {suffix != null && (
            <div className="govuk-input__suffix" aria-hidden="true">
              {suffix}
            </div>
          )}
        </div>
      ) : (
        input
      )}
    </FormGroup>
  );
});
