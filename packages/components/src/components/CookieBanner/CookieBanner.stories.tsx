import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CookieBanner, CookieBannerMessage } from './CookieBanner';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Cookie banner',
  component: CookieBanner,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Show a cookie banner the first time a user visits your service, before they consent to any non-essential cookies. Position it before everything else on the page, including the skip link.

**When not to use:** don't use it for anything except cookie consent, and don't show it once the user has made a choice.

[GOV.UK Design System: Cookie banner](https://design-system.service.gov.uk/components/cookie-banner/)`,
      },
    },
  },
} satisfies Meta<typeof CookieBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

const questionContent = (
  <>
    <p className="govuk-body">We use some essential cookies to make this service work.</p>
    <p className="govuk-body">
      We’d also like to use analytics cookies so we can understand how you use the service and make
      improvements.
    </p>
  </>
);

export const Default: Story = {
  args: {
    children: (
      <CookieBannerMessage
        heading="Cookies on [name of service]"
        actions={
          <>
            <Button type="button">Accept analytics cookies</Button>
            <Button type="button">Reject analytics cookies</Button>
            <a className="govuk-link" href="#">
              View cookies
            </a>
          </>
        }
      >
        {questionContent}
      </CookieBannerMessage>
    ),
  },
};

function FullFlow() {
  const [choice, setChoice] = useState<'accepted' | 'rejected' | null>(null);
  const [hidden, setHidden] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Move focus to the confirmation message so it is announced.
  useEffect(() => {
    if (choice) {
      wrapperRef.current?.querySelector<HTMLElement>('.govuk-cookie-banner__message')?.focus();
    }
  }, [choice]);

  if (hidden) {
    return (
      <p className="govuk-body govuk-!-padding-3">
        Cookie banner hidden — reload the story to start again.
      </p>
    );
  }
  return (
    <div ref={wrapperRef}>
      <CookieBanner>
        {choice === null ? (
          <CookieBannerMessage
            heading="Cookies on [name of service]"
            actions={
              <>
                <Button type="button" onClick={() => setChoice('accepted')}>
                  Accept analytics cookies
                </Button>
                <Button type="button" onClick={() => setChoice('rejected')}>
                  Reject analytics cookies
                </Button>
                <a className="govuk-link" href="#">
                  View cookies
                </a>
              </>
            }
          >
            {questionContent}
          </CookieBannerMessage>
        ) : (
          <CookieBannerMessage
            role="alert"
            tabIndex={-1}
            actions={
              <Button type="button" onClick={() => setHidden(true)}>
                Hide cookie message
              </Button>
            }
          >
            <p className="govuk-body">
              You’ve {choice} analytics cookies. You can{' '}
              <a className="govuk-link" href="#">
                change your cookie settings
              </a>{' '}
              at any time.
            </p>
          </CookieBannerMessage>
        )}
      </CookieBanner>
    </div>
  );
}

export const AcceptRejectFlow: Story = {
  args: { children: null },
  render: () => <FullFlow />,
  parameters: {
    docs: {
      description: {
        story:
          'The full client-side flow: question message, then a confirmation message with role="alert", then hidden once dismissed.',
      },
    },
  },
};
