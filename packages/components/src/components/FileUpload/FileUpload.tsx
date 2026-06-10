import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';
import { useOptionalId } from '../../internal/useId';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { FormGroup } from '../FormGroup/FormGroup';
import { Hint } from '../Hint/Hint';
import { Label } from '../Label/Label';

export interface FileUploadProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'children' | 'type'
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
  /** Extra ids to prepend to the input's `aria-describedby`. */
  describedBy?: string;
  /** Class name applied to the wrapping form group. */
  formGroupClassName?: string;
}

/**
 * GOV.UK File upload: the baseline native `<input type="file">` with label,
 * hint and error message composition — the version most services use.
 *
 * Note: govuk-frontend also ships a JavaScript-enhanced variant
 * (`javascript: true` + `data-module="govuk-file-upload"`) that replaces the
 * native control with a styled "Choose file" button and drag-and-drop drop
 * zone with live announcements. That enhancement is substantial (custom
 * button construction, document-level drag tracking, MutationObserver-based
 * disabled-state syncing) and is intentionally not ported here.
 *
 * @see https://design-system.service.gov.uk/components/file-upload/
 */
export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(function FileUpload(
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
    className,
    ...rest
  },
  ref,
) {
  const inputId = useOptionalId(id ?? name, 'govuk-file-upload');
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const ariaDescribedBy =
    classNames(describedBy, hint != null && hintId, errorMessage != null && errorId) || undefined;

  return (
    <FormGroup hasError={errorMessage != null} className={formGroupClassName}>
      <Label htmlFor={inputId} size={labelSize} isPageHeading={labelIsPageHeading}>
        {label}
      </Label>
      {hint != null && <Hint id={hintId}>{hint}</Hint>}
      {errorMessage != null && <ErrorMessage id={errorId}>{errorMessage}</ErrorMessage>}
      <input
        {...rest}
        ref={ref}
        id={inputId}
        name={name}
        type="file"
        className={classNames(
          'govuk-file-upload',
          errorMessage != null && 'govuk-file-upload--error',
          className,
        )}
        aria-describedby={ariaDescribedBy}
      />
    </FormGroup>
  );
});
