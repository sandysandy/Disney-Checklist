import { Fragment, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';
import { useOptionalId } from '../../internal/useId';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { Fieldset } from '../Fieldset/Fieldset';
import { FormGroup } from '../FormGroup/FormGroup';
import { Hint } from '../Hint/Hint';
import { Label } from '../Label/Label';

export interface CheckboxesDividerItem {
  /** Text to separate groups of options, e.g. "or". */
  divider: ReactNode;
}

export interface CheckboxesOptionItem {
  /** Value submitted when the checkbox is checked. */
  value: string;
  /** Label shown next to the checkbox. */
  label: ReactNode;
  /** Hint displayed below the item's label. */
  hint?: ReactNode;
  /** Content conditionally revealed when the checkbox is checked. */
  conditional?: ReactNode;
  /**
   * "None of the above" behaviour: checking this item unchecks all others in
   * the group, and checking any other item unchecks this one. Mirrors
   * govuk-frontend's `data-behaviour="exclusive"`.
   */
  exclusive?: boolean;
  /** Disable the checkbox. */
  disabled?: boolean;
  /** Explicit id for the input. Defaults to the id prefix (plus index). */
  id?: string;
}

export type CheckboxesItem = CheckboxesOptionItem | CheckboxesDividerItem;

export interface CheckboxesProps {
  /** Name shared by every checkbox in the group. */
  name: string;
  /** The checkboxes to render, including optional divider items. */
  items: CheckboxesItem[];
  /** The question asked of the user, rendered as the fieldset legend. */
  legend?: ReactNode;
  /** Size modifier for the legend, matching the GOV.UK heading scale. */
  legendSize?: 's' | 'm' | 'l' | 'xl';
  /** Wrap the legend text in an `<h1>` when the question is the page heading. */
  legendIsPageHeading?: boolean;
  /** Hint text displayed between the legend and the checkboxes. */
  hint?: ReactNode;
  /** When set, renders the error message and applies error styling. */
  errorMessage?: ReactNode;
  /** Checked values (controlled usage). */
  values?: string[];
  /** Initially checked values (uncontrolled usage). */
  defaultValues?: string[];
  /** Called with the full list of checked values after each change. */
  onChange?: (values: string[], event: ChangeEvent<HTMLInputElement>) => void;
  /** Render smaller checkboxes (`govuk-checkboxes--small`). */
  small?: boolean;
  /** Prefix used to generate item ids. Defaults to `name`. */
  idPrefix?: string;
  /** Class name applied to the `govuk-checkboxes` container. */
  className?: string;
  /** Class name applied to the wrapping form group. */
  formGroupClassName?: string;
  /** Extra ids to prepend to the fieldset's `aria-describedby`. */
  describedBy?: string;
}

function isDivider(item: CheckboxesItem): item is CheckboxesDividerItem {
  return 'divider' in item;
}

/**
 * GOV.UK Checkboxes, rendered in a fieldset with legend, hint and error
 * message wiring. Ports the govuk-frontend checkboxes behaviour: conditional
 * reveals (`aria-controls`/`aria-expanded` kept in sync with checked state)
 * and exclusive "None of the above" options that uncheck the rest of the
 * group. Supports controlled (`values`/`onChange`) and uncontrolled
 * (`defaultValues`) usage.
 *
 * @see https://design-system.service.gov.uk/components/checkboxes/
 */
export function Checkboxes({
  name,
  items,
  legend,
  legendSize,
  legendIsPageHeading,
  hint,
  errorMessage,
  values,
  defaultValues,
  onChange,
  small,
  idPrefix,
  className,
  formGroupClassName,
  describedBy,
}: CheckboxesProps) {
  const resolvedIdPrefix = useOptionalId(idPrefix ?? name, 'govuk-checkboxes');
  const hintId = `${resolvedIdPrefix}-hint`;
  const errorId = `${resolvedIdPrefix}-error`;
  const isControlled = values !== undefined;
  const [internalValues, setInternalValues] = useState<string[]>(defaultValues ?? []);
  const checkedValues = isControlled ? values : internalValues;
  const hasFieldset = legend != null;

  const groupDescribedBy =
    classNames(describedBy, hint != null && hintId, errorMessage != null && errorId) || undefined;

  const exclusiveValues = new Set(
    items
      .filter((item): item is CheckboxesOptionItem => !isDivider(item) && item.exclusive === true)
      .map((item) => item.value),
  );

  function handleChange(item: CheckboxesOptionItem, event: ChangeEvent<HTMLInputElement>) {
    const isChecked = event.target.checked;
    let next: string[];
    if (!isChecked) {
      next = checkedValues.filter((value) => value !== item.value);
    } else if (item.exclusive) {
      // Checking an exclusive option unchecks everything else in the group.
      next = [item.value];
    } else {
      // Checking a regular option unchecks any exclusive options.
      next = [
        ...checkedValues.filter((value) => value !== item.value && !exclusiveValues.has(value)),
        item.value,
      ];
    }
    if (!isControlled) {
      setInternalValues(next);
    }
    onChange?.(next, event);
  }

  const checkboxes = (
    <div
      className={classNames('govuk-checkboxes', small && 'govuk-checkboxes--small', className)}
      data-module="govuk-checkboxes"
    >
      {items.map((item, index) => {
        if (isDivider(item)) {
          return (
            <div key={`divider-${index}`} className="govuk-checkboxes__divider">
              {item.divider}
            </div>
          );
        }
        const itemId =
          item.id ?? (index === 0 ? resolvedIdPrefix : `${resolvedIdPrefix}-${index + 1}`);
        const conditionalId = `conditional-${itemId}`;
        const itemHintId = `${itemId}-item-hint`;
        const hasConditional = item.conditional != null;
        const isChecked = checkedValues.includes(item.value);
        const itemDescribedBy =
          classNames(!hasFieldset && groupDescribedBy, item.hint != null && itemHintId) ||
          undefined;
        return (
          <Fragment key={item.value}>
            <div className="govuk-checkboxes__item">
              <input
                className="govuk-checkboxes__input"
                id={itemId}
                name={name}
                type="checkbox"
                value={item.value}
                checked={isChecked}
                disabled={item.disabled}
                aria-controls={hasConditional ? conditionalId : undefined}
                aria-expanded={hasConditional ? isChecked : undefined}
                aria-describedby={itemDescribedBy}
                data-behaviour={item.exclusive ? 'exclusive' : undefined}
                onChange={(event) => handleChange(item, event)}
              />
              <Label className="govuk-checkboxes__label" htmlFor={itemId}>
                {item.label}
              </Label>
              {item.hint != null && (
                <Hint id={itemHintId} className="govuk-checkboxes__hint">
                  {item.hint}
                </Hint>
              )}
            </div>
            {hasConditional && (
              <div
                className={classNames(
                  'govuk-checkboxes__conditional',
                  !isChecked && 'govuk-checkboxes__conditional--hidden',
                )}
                id={conditionalId}
              >
                {item.conditional}
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );

  const inner = (
    <>
      {hint != null && <Hint id={hintId}>{hint}</Hint>}
      {errorMessage != null && <ErrorMessage id={errorId}>{errorMessage}</ErrorMessage>}
      {checkboxes}
    </>
  );

  return (
    <FormGroup hasError={errorMessage != null} className={formGroupClassName}>
      {hasFieldset ? (
        <Fieldset
          legend={legend}
          legendSize={legendSize}
          legendIsPageHeading={legendIsPageHeading}
          describedBy={groupDescribedBy}
        >
          {inner}
        </Fieldset>
      ) : (
        inner
      )}
    </FormGroup>
  );
}
