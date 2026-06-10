import { useNavigate } from 'react-router-dom';
import { InsetText, StartPage } from '@govuk-mui/react';

export function Start() {
  const navigate = useNavigate();
  return (
    <StartPage
      title="Apply for a juggling licence"
      startHref="/full-name"
      onStart={(event) => {
        event.preventDefault();
        navigate('/full-name');
      }}
      related={
        <aside role="complementary">
          <h2 className="govuk-heading-m">Related content</h2>
          <ul className="govuk-list govuk-!-font-size-16">
            <li>
              <a className="govuk-link" href="https://www.gov.uk">
                Street performance rules
              </a>
            </li>
            <li>
              <a className="govuk-link" href="https://www.gov.uk">
                Busking and street entertainment
              </a>
            </li>
          </ul>
        </aside>
      }
    >
      <p className="govuk-body">Use this service to apply for a licence to juggle in public.</p>
      <p className="govuk-body">Applying takes around 5 minutes.</p>
      <h2 className="govuk-heading-m">Before you start</h2>
      <p className="govuk-body">You will need:</p>
      <ul className="govuk-list govuk-list--bullet">
        <li>your full name</li>
        <li>details of the juggling tricks you can perform</li>
      </ul>
      <InsetText>
        You cannot apply on behalf of someone else — they must apply themselves.
      </InsetText>
    </StartPage>
  );
}
