import { PageNotFound, ProblemWithService, ServiceUnavailable } from '@govuk-mui/react';

export function NotFound() {
  return <PageNotFound />;
}

export function ServerError() {
  return (
    <ProblemWithService>
      <p className="govuk-body">Your answers have not been saved.</p>
    </ProblemWithService>
  );
}

export function Unavailable() {
  return <ServiceUnavailable serviceName="Apply for a juggling licence" />;
}
