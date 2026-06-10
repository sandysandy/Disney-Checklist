import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';

export interface FormGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode;
  /** Apply the error state (red left border) to the group. */
  hasError?: boolean;
}

/**
 * GOV.UK form group wrapper. Usually rendered for you by form components;
 * exported for advanced composition.
 */
export function FormGroup({ children, hasError, className, ...rest }: FormGroupProps) {
  return (
    <div
      {...rest}
      className={classNames('govuk-form-group', hasError && 'govuk-form-group--error', className)}
    >
      {children}
    </div>
  );
}
