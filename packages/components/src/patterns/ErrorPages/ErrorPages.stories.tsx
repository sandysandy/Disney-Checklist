import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageNotFound, ProblemWithService, ServiceUnavailable } from './ErrorPages';
import { PageTemplate } from '../PageTemplate/PageTemplate';

const meta = {
  title: 'Patterns/Error pages',
  component: PageNotFound,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `The three standard GOV.UK error pages with the recommended wording: page not found (404), problem with the service (500), and service unavailable.

See [Page not found pages](https://design-system.service.gov.uk/patterns/page-not-found-pages/), [Problem with the service pages](https://design-system.service.gov.uk/patterns/problem-with-the-service-pages/) and [Service unavailable pages](https://design-system.service.gov.uk/patterns/service-unavailable-pages/).`,
      },
    },
  },
  decorators: [
    (Story) => (
      <PageTemplate>
        <Story />
      </PageTemplate>
    ),
  ],
} satisfies Meta<typeof PageNotFound>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotFound404: Story = {
  render: () => (
    <PageNotFound>
      <p className="govuk-body">
        Contact the juggling licence helpline if the web address is correct or you need help.
      </p>
    </PageNotFound>
  ),
};

export const ProblemWithService500: Story = {
  render: () => (
    <ProblemWithService>
      <p className="govuk-body">Your answers have not been saved.</p>
      <p className="govuk-body">
        Contact the juggling licence helpline if you need to speak to someone.
      </p>
    </ProblemWithService>
  ),
};

export const Unavailable: Story = {
  render: () => <ServiceUnavailable serviceName="Apply for a juggling licence" />,
};
