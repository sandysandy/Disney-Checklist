import type { FieldsetHTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';

export interface FieldsetProps extends Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  'children'
> {
  children?: ReactNode;
  /** The legend describing the group of fields. */
  legend?: ReactNode;
  /** Size modifier for the legend, matching the GOV.UK heading scale. */
  legendSize?: 's' | 'm' | 'l' | 'xl';
  /**
   * Wrap the legend text in an `<h1>`. Use when the legend is the page
   * heading, i.e. the question is the only thing on the page.
   */
  legendIsPageHeading?: boolean;
  /** Element ids to add to `aria-describedby`, e.g. a hint or error message. */
  describedBy?: string;
}

/**
 * GOV.UK Fieldset, used to group related form inputs such as radios,
 * checkboxes or date inputs, with the question as its legend.
 *
 * @see https://design-system.service.gov.uk/components/fieldset/
 */
export function Fieldset({
  children,
  legend,
  legendSize,
  legendIsPageHeading,
  describedBy,
  className,
  ...rest
}: FieldsetProps) {
  return (
    <fieldset
      {...rest}
      className={classNames('govuk-fieldset', className)}
      aria-describedby={describedBy || undefined}
    >
      {legend != null && (
        <legend
          className={classNames(
            'govuk-fieldset__legend',
            legendSize && `govuk-fieldset__legend--${legendSize}`,
          )}
        >
          {legendIsPageHeading ? <h1 className="govuk-fieldset__heading">{legend}</h1> : legend}
        </legend>
      )}
      {children}
    </fieldset>
  );
}
