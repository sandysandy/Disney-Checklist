import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';

export interface BreadcrumbsItem {
  /** Text or content of the breadcrumb. */
  children: ReactNode;
  /**
   * Link for the breadcrumb. Omit on the last item to mark it as the current
   * page (`aria-current="page"`).
   */
  href?: string;
}

export interface BreadcrumbsProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Breadcrumbs, ordered from the top-level page down to the current page. */
  items: BreadcrumbsItem[];
  /** On mobile, show only the first and last items to save space. */
  collapseOnMobile?: boolean;
  /** Use the inverse style on dark backgrounds. */
  inverse?: boolean;
  /** Accessible name for the navigation landmark. Defaults to "Breadcrumb". */
  'aria-label'?: string;
}

/**
 * GOV.UK Breadcrumbs, showing users where the current page sits in the site
 * hierarchy.
 *
 * @see https://design-system.service.gov.uk/components/breadcrumbs/
 */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { items, collapseOnMobile, inverse, className, 'aria-label': ariaLabel = 'Breadcrumb', ...rest },
  ref,
) {
  return (
    <nav
      {...rest}
      ref={ref}
      className={classNames(
        'govuk-breadcrumbs',
        collapseOnMobile && 'govuk-breadcrumbs--collapse-on-mobile',
        inverse && 'govuk-breadcrumbs--inverse',
        className,
      )}
      aria-label={ariaLabel}
    >
      <ol className="govuk-breadcrumbs__list">
        {items.map((item, index) =>
          item.href ? (
            <li key={index} className="govuk-breadcrumbs__list-item">
              <a className="govuk-breadcrumbs__link" href={item.href}>
                {item.children}
              </a>
            </li>
          ) : (
            <li key={index} className="govuk-breadcrumbs__list-item" aria-current="page">
              {item.children}
            </li>
          ),
        )}
      </ol>
    </nav>
  );
});
