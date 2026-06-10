import { createContext, useContext } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';

export interface SummaryListAction {
  /** Destination of the action link. */
  href: string;
  /** Text of the action link, e.g. "Change". */
  children: ReactNode;
  /**
   * Visually hidden text appended to the link so screen reader users know
   * what the action refers to, e.g. "name".
   */
  visuallyHiddenText?: ReactNode;
  /** Extra classes for the link. */
  className?: string;
}

export interface SummaryListRow {
  /** The label of the row, e.g. "Name". */
  key: ReactNode;
  /** The user's answer or value. */
  value: ReactNode;
  /** Action links for the row, e.g. a "Change" link. */
  actions?: SummaryListAction[];
  /** Extra classes for the row. */
  className?: string;
}

export interface SummaryListProps extends Omit<HTMLAttributes<HTMLDListElement>, 'children'> {
  /** The rows in the summary list. */
  rows: SummaryListRow[];
  /** Remove the borders between rows (`govuk-summary-list--no-border`). */
  noBorder?: boolean;
}

/**
 * When a summary list is rendered inside a summary card, every action link
 * gets the card title appended to its visually hidden text — mirroring how
 * the Nunjucks template passes `params.card.title` into each action link.
 */
const SummaryCardTitleContext = createContext<ReactNode>(null);

function ActionLink({ action }: { action: SummaryListAction }) {
  const cardTitle = useContext(SummaryCardTitleContext);
  return (
    <a className={classNames('govuk-link', action.className)} href={action.href}>
      {action.children}
      {(action.visuallyHiddenText != null || cardTitle != null) && (
        <span className="govuk-visually-hidden">
          {action.visuallyHiddenText != null && <> {action.visuallyHiddenText}</>}
          {cardTitle != null && <> ({cardTitle})</>}
        </span>
      )}
    </a>
  );
}

/**
 * GOV.UK Summary list, used to summarise information such as a user's
 * answers at the end of a form ("Check your answers").
 *
 * @see https://design-system.service.gov.uk/components/summary-list/
 */
export function SummaryList({ rows, noBorder, className, ...rest }: SummaryListProps) {
  const anyRowHasActions = rows.some((row) => (row.actions?.length ?? 0) > 0);

  return (
    <dl
      {...rest}
      className={classNames(
        'govuk-summary-list',
        noBorder && 'govuk-summary-list--no-border',
        className,
      )}
    >
      {rows.map((row, rowIndex) => {
        const actions = row.actions ?? [];
        return (
          <div
            key={rowIndex}
            className={classNames(
              'govuk-summary-list__row',
              anyRowHasActions && actions.length === 0 && 'govuk-summary-list__row--no-actions',
              row.className,
            )}
          >
            <dt className="govuk-summary-list__key">{row.key}</dt>
            <dd className="govuk-summary-list__value">{row.value}</dd>
            {actions.length > 0 && (
              <dd className="govuk-summary-list__actions">
                {actions.length === 1 ? (
                  <ActionLink action={actions[0]} />
                ) : (
                  <ul className="govuk-summary-list__actions-list">
                    {actions.map((action, actionIndex) => (
                      <li key={actionIndex} className="govuk-summary-list__actions-list-item">
                        <ActionLink action={action} />
                      </li>
                    ))}
                  </ul>
                )}
              </dd>
            )}
          </div>
        );
      })}
    </dl>
  );
}

export interface SummaryCardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'title'
> {
  /** Title of the card. */
  title?: ReactNode;
  /** Heading level for the title. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Action links shown in the card's title bar. */
  actions?: SummaryListAction[];
  /** The card's content — normally a `SummaryList`. */
  children: ReactNode;
}

/**
 * GOV.UK Summary card: wraps a `SummaryList` with a title and card-level
 * actions, for summarising groups of related information. Action links inside
 * the card automatically have the card title appended to their visually
 * hidden text.
 *
 * @see https://design-system.service.gov.uk/components/summary-list/#summary-cards
 */
export function SummaryCard({
  title,
  headingLevel = 2,
  actions = [],
  children,
  className,
  ...rest
}: SummaryCardProps) {
  const Heading = `h${headingLevel}` as const;

  return (
    <SummaryCardTitleContext.Provider value={title ?? null}>
      <div {...rest} className={classNames('govuk-summary-card', className)}>
        <div className="govuk-summary-card__title-wrapper">
          {title != null && <Heading className="govuk-summary-card__title">{title}</Heading>}
          {actions.length === 1 && (
            <div className="govuk-summary-card__actions">
              <ActionLink action={actions[0]} />
            </div>
          )}
          {actions.length > 1 && (
            <ul className="govuk-summary-card__actions">
              {actions.map((action, index) => (
                <li key={index} className="govuk-summary-card__action">
                  <ActionLink action={action} />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="govuk-summary-card__content">{children}</div>
      </div>
    </SummaryCardTitleContext.Provider>
  );
}
