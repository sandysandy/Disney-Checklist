import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';

export interface PaginationItem {
  /** Page number shown in the link. */
  number?: ReactNode;
  /** Link to the page. */
  href?: string;
  /** Mark this item as the current page. */
  current?: boolean;
  /** Render an ellipsis (⋯) instead of a page link to skip pages. */
  ellipsis?: boolean;
  /**
   * Accessible label for the link. Defaults to "Page <number>" when the
   * number is plain text.
   */
  visuallyHiddenText?: string;
}

export interface PaginationLink {
  /** Destination of the previous/next link. */
  href: string;
  /** Link text. Defaults to "Previous page"/"Next page" (with the word "page" visually hidden). */
  children?: ReactNode;
  /** Block-level pagination only: label below the link, e.g. the page title. */
  labelText?: string;
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * Page items for numbered pagination. Omit (and supply only `previous` /
   * `next`) for block-level pagination between pages in a sequence.
   */
  items?: PaginationItem[];
  /** Link to the previous page. */
  previous?: PaginationLink;
  /** Link to the next page. */
  next?: PaginationLink;
  /** Accessible name for the navigation landmark. Defaults to "Pagination". */
  'aria-label'?: string;
}

function ArrowPrevious() {
  return (
    <svg
      className="govuk-pagination__icon govuk-pagination__icon--prev"
      xmlns="http://www.w3.org/2000/svg"
      height="13"
      width="15"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 15 13"
    >
      <path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
    </svg>
  );
}

function ArrowNext() {
  return (
    <svg
      className="govuk-pagination__icon govuk-pagination__icon--next"
      xmlns="http://www.w3.org/2000/svg"
      height="13"
      width="15"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 15 13"
    >
      <path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
    </svg>
  );
}

function ArrowLink({
  link,
  type,
  blockLevel,
}: {
  link: PaginationLink;
  type: 'prev' | 'next';
  blockLevel: boolean;
}) {
  const arrow = type === 'prev' ? <ArrowPrevious /> : <ArrowNext />;
  const text = link.children ?? (
    <>
      {type === 'prev' ? 'Previous' : 'Next'}
      <span className="govuk-visually-hidden"> page</span>
    </>
  );

  return (
    <div className={`govuk-pagination__${type}`}>
      <a className="govuk-link govuk-pagination__link" href={link.href} rel={type}>
        {(blockLevel || type === 'prev') && arrow}
        <span
          className={classNames(
            'govuk-pagination__link-title',
            blockLevel && !link.labelText && 'govuk-pagination__link-title--decorated',
          )}
        >
          {text}
        </span>
        {link.labelText && blockLevel && (
          <>
            <span className="govuk-visually-hidden">:</span>
            <span className="govuk-pagination__link-label">{link.labelText}</span>
          </>
        )}
        {!blockLevel && type === 'next' && arrow}
      </a>
    </div>
  );
}

function PageItem({ item }: { item: PaginationItem }) {
  if (item.ellipsis) {
    return <li className="govuk-pagination__item govuk-pagination__item--ellipsis">{'⋯'}</li>;
  }

  const visuallyHiddenText =
    item.visuallyHiddenText ??
    (typeof item.number === 'string' || typeof item.number === 'number'
      ? `Page ${item.number}`
      : undefined);

  return (
    <li
      className={classNames(
        'govuk-pagination__item',
        item.current && 'govuk-pagination__item--current',
      )}
    >
      <a
        className="govuk-link govuk-pagination__link"
        href={item.href}
        aria-label={visuallyHiddenText}
        aria-current={item.current ? 'page' : undefined}
      >
        {item.number}
      </a>
    </li>
  );
}

/**
 * GOV.UK Pagination.
 *
 * Supports numbered pagination for lists of results, and block-level
 * previous/next pagination (with optional labels) for pages in a sequence.
 *
 * @see https://design-system.service.gov.uk/components/pagination/
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { items, previous, next, className, 'aria-label': ariaLabel = 'Pagination', ...rest },
  ref,
) {
  const blockLevel = !items && Boolean(next || previous);

  return (
    <nav
      {...rest}
      ref={ref}
      className={classNames('govuk-pagination', blockLevel && 'govuk-pagination--block', className)}
      aria-label={ariaLabel}
    >
      {previous?.href && <ArrowLink link={previous} type="prev" blockLevel={blockLevel} />}
      {items && (
        <ul className="govuk-pagination__list">
          {items.map((item, index) => (
            <PageItem key={index} item={item} />
          ))}
        </ul>
      )}
      {next?.href && <ArrowLink link={next} type="next" blockLevel={blockLevel} />}
    </nav>
  );
});
