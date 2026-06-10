import type { HTMLAttributes, ReactNode } from 'react';
import { Button } from '../../components/Button/Button';

export interface StartPageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  /** The service name, as the page `<h1>`. */
  title: ReactNode;
  /**
   * What the service does, eligibility, what's needed before starting —
   * `govuk-body` paragraphs and lists.
   */
  children: ReactNode;
  /** Where the "Start now" button goes: the first question page. */
  startHref: string;
  /** Text of the start button. Defaults to "Start now". */
  startButtonText?: ReactNode;
  /** Called when the start button is clicked (e.g. for router navigation). */
  onStart?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  /** Content after the start button, e.g. "other ways to apply". */
  afterStart?: ReactNode;
  /** Related links sidebar (one-third column). */
  related?: ReactNode;
}

/**
 * GOV.UK Start page layout: service title, guidance content, a green
 * "Start now" button with the arrow icon, and an optional related-links
 * sidebar. Start pages live on GOV.UK itself; in a prototype this pattern
 * stands in for that page.
 *
 * @see https://design-system.service.gov.uk/patterns/start-using-a-service/
 */
export function StartPage({
  title,
  children,
  startHref,
  startButtonText = 'Start now',
  onStart,
  afterStart,
  related,
  ...rest
}: StartPageProps) {
  return (
    <div {...rest}>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-xl">{title}</h1>
          {children}
          <Button href={startHref} isStartButton onClick={onStart}>
            {startButtonText}
          </Button>
          {afterStart}
        </div>
        {related != null && <div className="govuk-grid-column-one-third">{related}</div>}
      </div>
    </div>
  );
}
