import { useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';
import { useOptionalId } from '../../internal/useId';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { Fieldset } from '../Fieldset/Fieldset';
import { FormGroup } from '../FormGroup/FormGroup';
import { Hint } from '../Hint/Hint';
import { Label } from '../Label/Label';

export type DateInputField = 'day' | 'month' | 'year';

export interface DateInputValues {
  day?: string;
  month?: string;
  year?: string;
}

export interface DateInputProps {
  /** The question asked of the user, rendered as the fieldset legend. */
  legend?: ReactNode;
  /** Size modifier for the legend, matching the GOV.UK heading scale. */
  legendSize?: 's' | 'm' | 'l' | 'xl';
  /** Wrap the legend text in an `<h1>` when the question is the page heading. */
  legendIsPageHeading?: boolean;
  /** Hint text displayed between the legend and the inputs, e.g. "For example, 27 3 2007". */
  hint?: ReactNode;
  /** When set, renders the error message and applies error styling. */
  errorMessage?: ReactNode;
  /**
   * Which fields to highlight with `govuk-input--error`. Defaults to every
   * field when `errorMessage` is set, matching the GOV.UK guidance to
   * highlight the whole date when you do not know which part is wrong.
   */
  errorFields?: DateInputField[];
  /** Id prefix for the group; field inputs get `-day`/`-month`/`-year` suffixes. */
  id?: string;
  /** Prefix for the field names, e.g. `passport-issued` gives `passport-issued-day`. */
  namePrefix?: string;
  /** Field values (controlled usage). */
  values?: DateInputValues;
  /** Initial field values (uncontrolled usage). */
  defaultValues?: DateInputValues;
  /** Called with all field values whenever one of them changes. */
  onChange?: (values: DateInputValues, event: ChangeEvent<HTMLInputElement>) => void;
  /** `autocomplete` attributes per field, e.g. `{ day: 'bday-day' }` for dates of birth. */
  autocomplete?: Partial<Record<DateInputField, string>>;
  /** Class name applied to the `govuk-date-input` container. */
  className?: string;
  /** Class name applied to the wrapping form group. */
  formGroupClassName?: string;
  /** Extra ids to prepend to the fieldset's `aria-describedby`. */
  describedBy?: string;
}

const FIELDS: Array<{ field: DateInputField; label: string; width: '2' | '4' }> = [
  { field: 'day', label: 'Day', width: '2' },
  { field: 'month', label: 'Month', width: '2' },
  { field: 'year', label: 'Year', width: '4' },
];

/**
 * GOV.UK Date input: three text fields (day, month, year) for memorable
 * dates, grouped in a fieldset with `role="group"` so the legend and hint are
 * announced correctly. Supports highlighting individual fields in error via
 * `errorFields`. Supports controlled (`values`/`onChange`) and uncontrolled
 * (`defaultValues`) usage.
 *
 * @see https://design-system.service.gov.uk/components/date-input/
 */
export function DateInput({
  legend,
  legendSize,
  legendIsPageHeading,
  hint,
  errorMessage,
  errorFields,
  id,
  namePrefix,
  values,
  defaultValues,
  onChange,
  autocomplete,
  className,
  formGroupClassName,
  describedBy,
}: DateInputProps) {
  const groupId = useOptionalId(id ?? namePrefix, 'govuk-date-input');
  const hintId = `${groupId}-hint`;
  const errorId = `${groupId}-error`;
  const isControlled = values !== undefined;
  const [internalValues, setInternalValues] = useState<DateInputValues>(defaultValues ?? {});
  const currentValues = isControlled ? values : internalValues;
  const erroredFields = errorFields ?? (errorMessage != null ? ['day', 'month', 'year'] : []);

  const fieldsetDescribedBy =
    classNames(describedBy, hint != null && hintId, errorMessage != null && errorId) || undefined;

  function handleChange(field: DateInputField, event: ChangeEvent<HTMLInputElement>) {
    const next = { ...currentValues, [field]: event.target.value };
    if (!isControlled) {
      setInternalValues(next);
    }
    onChange?.(next, event);
  }

  const inner = (
    <>
      {hint != null && <Hint id={hintId}>{hint}</Hint>}
      {errorMessage != null && <ErrorMessage id={errorId}>{errorMessage}</ErrorMessage>}
      <div className={classNames('govuk-date-input', className)} id={groupId}>
        {FIELDS.map(({ field, label, width }) => {
          const fieldId = `${groupId}-${field}`;
          return (
            <div key={field} className="govuk-date-input__item">
              <FormGroup>
                <Label className="govuk-date-input__label" htmlFor={fieldId}>
                  {label}
                </Label>
                <input
                  className={classNames(
                    'govuk-input govuk-date-input__input',
                    `govuk-input--width-${width}`,
                    erroredFields.includes(field) && 'govuk-input--error',
                  )}
                  id={fieldId}
                  name={namePrefix ? `${namePrefix}-${field}` : field}
                  type="text"
                  inputMode="numeric"
                  autoComplete={autocomplete?.[field]}
                  value={currentValues[field] ?? ''}
                  onChange={(event) => handleChange(field, event)}
                />
              </FormGroup>
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <FormGroup hasError={errorMessage != null} className={formGroupClassName}>
      {legend != null ? (
        <Fieldset
          // JAWS does not announce the description of a fieldset of text
          // inputs without an explicit group role (see govuk-frontend).
          role="group"
          legend={legend}
          legendSize={legendSize}
          legendIsPageHeading={legendIsPageHeading}
          describedBy={fieldsetDescribedBy}
        >
          {inner}
        </Fieldset>
      ) : (
        inner
      )}
    </FormGroup>
  );
}
