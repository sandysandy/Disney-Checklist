import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { PageTemplate, PhaseBanner, ServiceNavigation } from '@govuk-mui/react';
import { RouterLinks } from './RouterLinks';

/** Shared GOV.UK page chrome for every page of the prototype. */
export function Layout() {
  const location = useLocation();

  // Reset scroll between "pages", as a server-rendered service would.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <RouterLinks>
      <PageTemplate
        serviceNavigation={
          <ServiceNavigation serviceName="Apply for a juggling licence" serviceUrl="/" />
        }
        phaseBanner={
          <PhaseBanner tag="Beta">
            This is a new service – your{' '}
            <a className="govuk-link" href="https://www.gov.uk">
              feedback
            </a>{' '}
            will help us to improve it.
          </PhaseBanner>
        }
      >
        <Outlet />
      </PageTemplate>
    </RouterLinks>
  );
}
