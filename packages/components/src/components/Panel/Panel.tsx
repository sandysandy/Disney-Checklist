import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';

export interface PanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  /** The panel headline, e.g. "Application complete". */
  title: ReactNode;
  /** Heading level for the title. Defaults to 1, as on confirmation pages. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Supporting content, e.g. the reference number. */
  children?: ReactNode;
}

/**
 * GOV.UK Panel (confirmation panel), used on confirmation pages to tell
 * users they have successfully completed a transaction.
 *
 * @see https://design-system.service.gov.uk/components/panel/
 */
export function Panel({ title, headingLevel = 1, children, className, ...rest }: PanelProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <div {...rest} className={classNames('govuk-panel', 'govuk-panel--confirmation', className)}>
      <Heading className="govuk-panel__title">{title}</Heading>
      {children != null && <div className="govuk-panel__body">{children}</div>}
    </div>
  );
}
