import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';

export interface ErrorMessageProps extends Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> {
  children: ReactNode;
  /**
   * Visually hidden prefix announced before the error, so screen reader users
   * know the text is an error. Set to `false` to omit. Defaults to "Error".
   */
  visuallyHiddenText?: string | false;
}

/**
 * GOV.UK Error message. Follow the content guidance: be clear and concise,
 * describe what went wrong and how to fix it.
 *
 * @see https://design-system.service.gov.uk/components/error-message/
 */
export function ErrorMessage({
  children,
  visuallyHiddenText = 'Error',
  className,
  ...rest
}: ErrorMessageProps) {
  return (
    <p {...rest} className={classNames('govuk-error-message', className)}>
      {visuallyHiddenText !== false && (
        <span className="govuk-visually-hidden">{visuallyHiddenText}:</span>
      )}{' '}
      {children}
    </p>
  );
}
