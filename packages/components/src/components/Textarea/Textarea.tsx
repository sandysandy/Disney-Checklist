import { forwardRef } from 'react';
import type { ReactNode, TextareaHTMLAttributes } from 'react';
import { classNames } from '../../internal/classNames';
import { useOptionalId } from '../../internal/useId';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { FormGroup } from '../FormGroup/FormGroup';
import { Hint } from '../Hint/Hint';
import { Label } from '../Label/Label';

export interface TextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'children'
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
  /** Extra ids to prepend to the textarea's `aria-describedby`. */
  describedBy?: string;
  /** Class name applied to the wrapping form group. */
  formGroupClassName?: string;
}

/**
 * GOV.UK Textarea, including label, hint and error message composition with
 * correct `aria-describedby` wiring. Defaults to 5 rows; make the textarea
 * taller than the expected answer so users can see everything they type.
 *
 * @see https://design-system.service.gov.uk/components/textarea/
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    labelSize,
    labelIsPageHeading,
    hint,
    errorMessage,
    describedBy,
    formGroupClassName,
    id,
    name,
    rows = 5,
    className,
    ...rest
  },
  ref,
) {
  const textareaId = useOptionalId(id ?? name, 'govuk-textarea');
  const hintId = `${textareaId}-hint`;
  const errorId = `${textareaId}-error`;
  const ariaDescribedBy =
    classNames(describedBy, hint != null && hintId, errorMessage != null && errorId) || undefined;

  return (
    <FormGroup hasError={errorMessage != null} className={formGroupClassName}>
      <Label htmlFor={textareaId} size={labelSize} isPageHeading={labelIsPageHeading}>
        {label}
      </Label>
      {hint != null && <Hint id={hintId}>{hint}</Hint>}
      {errorMessage != null && <ErrorMessage id={errorId}>{errorMessage}</ErrorMessage>}
      <textarea
        {...rest}
        ref={ref}
        id={textareaId}
        name={name}
        rows={rows}
        className={classNames(
          'govuk-textarea',
          errorMessage != null && 'govuk-textarea--error',
          className,
        )}
        aria-describedby={ariaDescribedBy}
      />
    </FormGroup>
  );
});
