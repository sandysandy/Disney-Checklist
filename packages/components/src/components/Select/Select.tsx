import { forwardRef } from 'react';
import type { ReactNode, SelectHTMLAttributes } from 'react';
import { classNames } from '../../internal/classNames';
import { useOptionalId } from '../../internal/useId';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { FormGroup } from '../FormGroup/FormGroup';
import { Hint } from '../Hint/Hint';
import { Label } from '../Label/Label';

export interface SelectItem {
  /** Value submitted for the option. Defaults to the option's text content. */
  value?: string;
  /** Text content of the option. */
  label: string;
  /** Disable the option. */
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  /** The question or label for the select. */
  label: ReactNode;
  /** Size modifier for the label, matching the GOV.UK heading scale. */
  labelSize?: 's' | 'm' | 'l' | 'xl';
  /** Render the label inside an `<h1>` when the question is the page heading. */
  labelIsPageHeading?: boolean;
  /** Hint text displayed between the label and the select. */
  hint?: ReactNode;
  /** When set, renders the error message and applies error styling. */
  errorMessage?: ReactNode;
  /** The options to render. */
  items: SelectItem[];
  /** Stretch the select to the full width of its container. */
  fullWidth?: boolean;
  /** Extra ids to prepend to the select's `aria-describedby`. */
  describedBy?: string;
  /** Class name applied to the wrapping form group. */
  formGroupClassName?: string;
}

/**
 * GOV.UK Select, including label, hint and error message composition with
 * correct `aria-describedby` wiring. Only use a select as a last resort —
 * user research shows some users find them very difficult to use.
 *
 * @see https://design-system.service.gov.uk/components/select/
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    labelSize,
    labelIsPageHeading,
    hint,
    errorMessage,
    items,
    fullWidth,
    describedBy,
    formGroupClassName,
    id,
    name,
    className,
    ...rest
  },
  ref,
) {
  const selectId = useOptionalId(id ?? name, 'govuk-select');
  const hintId = `${selectId}-hint`;
  const errorId = `${selectId}-error`;
  const ariaDescribedBy =
    classNames(describedBy, hint != null && hintId, errorMessage != null && errorId) || undefined;

  return (
    <FormGroup hasError={errorMessage != null} className={formGroupClassName}>
      <Label htmlFor={selectId} size={labelSize} isPageHeading={labelIsPageHeading}>
        {label}
      </Label>
      {hint != null && <Hint id={hintId}>{hint}</Hint>}
      {errorMessage != null && <ErrorMessage id={errorId}>{errorMessage}</ErrorMessage>}
      <select
        {...rest}
        ref={ref}
        id={selectId}
        name={name}
        className={classNames(
          'govuk-select',
          errorMessage != null && 'govuk-select--error',
          fullWidth && 'govuk-!-width-full',
          className,
        )}
        aria-describedby={ariaDescribedBy}
      >
        {items.map((item, index) => (
          <option
            key={item.value ?? item.label ?? index}
            value={item.value}
            disabled={item.disabled}
          >
            {item.label}
          </option>
        ))}
      </select>
    </FormGroup>
  );
});
