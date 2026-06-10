import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';

export interface InsetTextProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The content to differentiate from the text surrounding it. */
  children: ReactNode;
}

/**
 * GOV.UK Inset text, used to differentiate a block of text from the content
 * that surrounds it.
 *
 * @see https://design-system.service.gov.uk/components/inset-text/
 */
export function InsetText({ children, className, ...rest }: InsetTextProps) {
  return (
    <div {...rest} className={classNames('govuk-inset-text', className)}>
      {children}
    </div>
  );
}
