import { forwardRef } from 'react';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';

export interface BackLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'children' | 'href'
> {
  /** Link text. Defaults to "Back". */
  children?: ReactNode;
  /** Destination, usually the previous page. Defaults to "#". */
  href?: string;
  /** Use the inverse style on dark backgrounds. */
  inverse?: boolean;
}

/**
 * GOV.UK Back link.
 *
 * @see https://design-system.service.gov.uk/components/back-link/
 */
export const BackLink = forwardRef<HTMLAnchorElement, BackLinkProps>(function BackLink(
  { children = 'Back', href = '#', inverse, className, ...rest },
  ref,
) {
  return (
    <a
      {...rest}
      ref={ref}
      href={href}
      className={classNames('govuk-back-link', inverse && 'govuk-back-link--inverse', className)}
    >
      {children}
    </a>
  );
});
