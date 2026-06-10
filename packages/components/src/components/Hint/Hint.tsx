import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';

export interface HintProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode;
}

/**
 * GOV.UK Hint text. Usually rendered for you by form components; exported for
 * advanced composition. Associate it with the form control via
 * `aria-describedby`.
 */
export function Hint({ children, className, ...rest }: HintProps) {
  return (
    <div {...rest} className={classNames('govuk-hint', className)}>
      {children}
    </div>
  );
}
