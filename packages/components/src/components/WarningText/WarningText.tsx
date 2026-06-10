import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';

export interface WarningTextProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The warning message. */
  children: ReactNode;
  /**
   * Visually hidden fallback text announced before the warning, replacing
   * the "!" icon for screen reader users.
   */
  iconFallbackText?: string;
}

/**
 * GOV.UK Warning text, used when you need to warn users about something
 * important, such as legal consequences of an action.
 *
 * @see https://design-system.service.gov.uk/components/warning-text/
 */
export function WarningText({
  children,
  iconFallbackText = 'Warning',
  className,
  ...rest
}: WarningTextProps) {
  return (
    <div {...rest} className={classNames('govuk-warning-text', className)}>
      <span className="govuk-warning-text__icon" aria-hidden="true">
        !
      </span>
      <strong className="govuk-warning-text__text">
        <span className="govuk-visually-hidden">{iconFallbackText}</span>
        {children}
      </strong>
    </div>
  );
}
