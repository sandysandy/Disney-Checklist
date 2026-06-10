import type { LabelHTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';

export interface LabelProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'children'> {
  children: ReactNode;
  /** Size modifier matching the GOV.UK heading scale. */
  size?: 's' | 'm' | 'l' | 'xl';
  /**
   * Wrap the label in an `<h1>`. Use when the label is the page heading,
   * i.e. the question is the only thing on the page.
   */
  isPageHeading?: boolean;
}

/**
 * GOV.UK Label. Usually rendered for you by form components such as
 * `TextInput`; exported for advanced composition.
 */
export function Label({ children, size, isPageHeading, className, ...rest }: LabelProps) {
  const label = (
    <label
      {...rest}
      className={classNames('govuk-label', size && `govuk-label--${size}`, className)}
    >
      {children}
    </label>
  );
  return isPageHeading ? <h1 className="govuk-label-wrapper">{label}</h1> : label;
}
