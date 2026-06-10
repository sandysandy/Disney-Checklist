import type { HTMLAttributes, ReactNode } from 'react';
import { Panel } from '../../components/Panel/Panel';

export interface ConfirmationPageProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'title'
> {
  /** Headline in the green panel, e.g. "Application complete". */
  title: ReactNode;
  /** Reference number line inside the panel. */
  reference?: ReactNode;
  /**
   * What happens next: contact details confirmation, next steps, feedback
   * link. Defaults expect `govuk-body` paragraphs and `govuk-heading-m`
   * subheadings.
   */
  children?: ReactNode;
}

/**
 * GOV.UK Confirmation page: a green panel confirming completion, the
 * reference number, and what happens next. Do not show a confirmation page
 * for steps within a journey — only at the very end.
 *
 * @see https://design-system.service.gov.uk/patterns/confirmation-pages/
 */
export function ConfirmationPage({ title, reference, children, ...rest }: ConfirmationPageProps) {
  return (
    <div {...rest} className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <Panel title={title}>
          {reference != null && (
            <>
              Your reference number
              <br />
              <strong>{reference}</strong>
            </>
          )}
        </Panel>
        {children}
      </div>
    </div>
  );
}
