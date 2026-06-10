import type { ReactNode } from 'react';

interface ErrorPageContentProps {
  /** Extra content, e.g. contact details for the service. */
  children?: ReactNode;
}

/**
 * GOV.UK "Page not found" (404) content, using the recommended wording.
 *
 * @see https://design-system.service.gov.uk/patterns/page-not-found-pages/
 */
export function PageNotFound({ children }: ErrorPageContentProps) {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-l">Page not found</h1>
        <p className="govuk-body">If you typed the web address, check it is correct.</p>
        <p className="govuk-body">
          If you pasted the web address, check you copied the entire address.
        </p>
        {children}
      </div>
    </div>
  );
}

/**
 * GOV.UK "Sorry, there is a problem with the service" (500) content, using
 * the recommended wording.
 *
 * @see https://design-system.service.gov.uk/patterns/problem-with-the-service-pages/
 */
export function ProblemWithService({ children }: ErrorPageContentProps) {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-l">Sorry, there is a problem with the service</h1>
        <p className="govuk-body">Try again later.</p>
        {children}
      </div>
    </div>
  );
}

export interface ServiceUnavailableProps extends ErrorPageContentProps {
  /** Name of the service, used in the heading. */
  serviceName: ReactNode;
}

/**
 * GOV.UK "Service unavailable" content, using the recommended wording.
 *
 * @see https://design-system.service.gov.uk/patterns/service-unavailable-pages/
 */
export function ServiceUnavailable({ serviceName, children }: ServiceUnavailableProps) {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-l">Sorry, the service is unavailable</h1>
        {children ?? <p className="govuk-body">You will be able to use {serviceName} later.</p>}
      </div>
    </div>
  );
}
