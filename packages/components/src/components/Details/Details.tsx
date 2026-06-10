import { forwardRef } from 'react';
import type { DetailsHTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';

export interface DetailsProps extends Omit<DetailsHTMLAttributes<HTMLDetailsElement>, 'children'> {
  /** The summary line users click to show or hide the detail. */
  summary: ReactNode;
  /** The detail revealed when the summary is clicked. */
  children: ReactNode;
}

/**
 * GOV.UK Details, using the native `<details>`/`<summary>` disclosure
 * elements. The `open` and `onToggle` attributes pass straight through to
 * the native element.
 *
 * @see https://design-system.service.gov.uk/components/details/
 */
export const Details = forwardRef<HTMLDetailsElement, DetailsProps>(function Details(
  { summary, children, className, ...rest },
  ref,
) {
  return (
    <details {...rest} ref={ref} className={classNames('govuk-details', className)}>
      <summary className="govuk-details__summary">
        <span className="govuk-details__summary-text">{summary}</span>
      </summary>
      <div className="govuk-details__text">{children}</div>
    </details>
  );
});
