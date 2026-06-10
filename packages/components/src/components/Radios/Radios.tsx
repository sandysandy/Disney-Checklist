import { Fragment, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';
import { useOptionalId } from '../../internal/useId';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { Fieldset } from '../Fieldset/Fieldset';
import { FormGroup } from '../FormGroup/FormGroup';
import { Hint } from '../Hint/Hint';
import { Label } from '../Label/Label';

export interface RadiosDividerItem {
  /** Text to separate groups of options, e.g. "or". */
  divider: ReactNode;
}

export interface RadiosOptionItem {
  /** Value submitted when the radio is checked. */
  value: string;
  /** Label shown next to the radio. */
  label: ReactNode;
  /** Hint displayed below the item's label. */
  hint?: ReactNode;
  /** Content conditionally revealed when the radio is checked. */
  conditional?: ReactNode;
  /** Disable the radio. */
  disabled?: boolean;
  /** Explicit id for the input. Defaults to the id prefix (plus index). */
  id?: string;
}

export type RadiosItem = RadiosOptionItem | RadiosDividerItem;

export interface RadiosProps {
  /** Name shared by every radio in the group. */
  name: string;
  /** The radios to render, including optional divider items. */
  items: RadiosItem[];
  /** The question asked of the user, rendered as the fieldset legend. */
  legend?: ReactNode;
  /** Size modifier for the legend, matching the GOV.UK heading scale. */
  legendSize?: 's' | 'm' | 'l' | 'xl';
  /** Wrap the legend text in an `<h1>` when the question is the page heading. */
  legendIsPageHeading?: boolean;
  /** Hint text displayed between the legend and the radios. */
  hint?: ReactNode;
  /** When set, renders the error message and applies error styling. */
  errorMessage?: ReactNode;
  /** Checked value (controlled usage). */
  value?: string;
  /** Initially checked value (uncontrolled usage). */
  defaultValue?: string;
  /** Called with the newly checked value. */
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  /** Render smaller radios (`govuk-radios--small`). */
  small?: boolean;
  /** Render the radios in a horizontal row (`govuk-radios--inline`). */
  inline?: boolean;
  /** Prefix used to generate item ids. Defaults to `name`. */
  idPrefix?: string;
  /** Class name applied to the `govuk-radios` container. */
  className?: string;
  /** Class name applied to the wrapping form group. */
  formGroupClassName?: string;
  /** Extra ids to prepend to the fieldset's `aria-describedby`. */
  describedBy?: string;
}

function isDivider(item: RadiosItem): item is RadiosDividerItem {
  return 'divider' in item;
}

/**
 * GOV.UK Radios, rendered in a fieldset with legend, hint and error message
 * wiring. Ports the govuk-frontend radios behaviour: conditional reveals are
 * toggled with `aria-controls`/`aria-expanded` kept in sync with the checked
 * radio. Supports controlled (`value`/`onChange`) and uncontrolled
 * (`defaultValue`) usage.
 *
 * @see https://design-system.service.gov.uk/components/radios/
 */
export function Radios({
  name,
  items,
  legend,
  legendSize,
  legendIsPageHeading,
  hint,
  errorMessage,
  value,
  defaultValue,
  onChange,
  small,
  inline,
  idPrefix,
  className,
  formGroupClassName,
  describedBy,
}: RadiosProps) {
  const resolvedIdPrefix = useOptionalId(idPrefix ?? name, 'govuk-radios');
  const hintId = `${resolvedIdPrefix}-hint`;
  const errorId = `${resolvedIdPrefix}-error`;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const checkedValue = isControlled ? value : internalValue;

  const fieldsetDescribedBy =
    classNames(describedBy, hint != null && hintId, errorMessage != null && errorId) || undefined;

  function handleChange(itemValue: string, event: ChangeEvent<HTMLInputElement>) {
    if (!isControlled) {
      setInternalValue(itemValue);
    }
    onChange?.(itemValue, event);
  }

  const radios = (
    <div
      className={classNames(
        'govuk-radios',
        small && 'govuk-radios--small',
        inline && 'govuk-radios--inline',
        className,
      )}
      data-module="govuk-radios"
    >
      {items.map((item, index) => {
        if (isDivider(item)) {
          return (
            <div key={`divider-${index}`} className="govuk-radios__divider">
              {item.divider}
            </div>
          );
        }
        const itemId =
          item.id ?? (index === 0 ? resolvedIdPrefix : `${resolvedIdPrefix}-${index + 1}`);
        const conditionalId = `conditional-${itemId}`;
        const itemHintId = `${itemId}-item-hint`;
        const hasConditional = item.conditional != null;
        const isChecked = checkedValue === item.value;
        return (
          <Fragment key={item.value}>
            <div className="govuk-radios__item">
              <input
                className="govuk-radios__input"
                id={itemId}
                name={name}
                type="radio"
                value={item.value}
                checked={isChecked}
                disabled={item.disabled}
                aria-controls={hasConditional ? conditionalId : undefined}
                aria-expanded={hasConditional ? isChecked : undefined}
                aria-describedby={item.hint != null ? itemHintId : undefined}
                onChange={(event) => handleChange(item.value, event)}
              />
              <Label className="govuk-radios__label" htmlFor={itemId}>
                {item.label}
              </Label>
              {item.hint != null && (
                <Hint id={itemHintId} className="govuk-radios__hint">
                  {item.hint}
                </Hint>
              )}
            </div>
            {hasConditional && (
              <div
                className={classNames(
                  'govuk-radios__conditional',
                  !isChecked && 'govuk-radios__conditional--hidden',
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
      {radios}
    </>
  );

  return (
    <FormGroup hasError={errorMessage != null} className={formGroupClassName}>
      {legend != null ? (
        <Fieldset
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
