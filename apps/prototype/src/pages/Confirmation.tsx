import { ConfirmationPage } from '@govuk-mui/react';

export function Confirmation() {
  return (
    <ConfirmationPage title="Application complete" reference="HDJ2123F">
      <p className="govuk-body">We have sent you a confirmation email.</p>
      <h2 className="govuk-heading-m">What happens next</h2>
      <p className="govuk-body">
        We’ve sent your application to your local juggling licence office.
      </p>
      <p className="govuk-body">
        They will contact you either to confirm your licence, or to ask for more information.
      </p>
      <p className="govuk-body">
        <a className="govuk-link" href="https://www.gov.uk">
          What did you think of this service?
        </a>{' '}
        (takes 30 seconds)
      </p>
    </ConfirmationPage>
  );
}
