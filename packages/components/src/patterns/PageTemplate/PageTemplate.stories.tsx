import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageTemplate } from './PageTemplate';
import { BackLink } from '../../components/BackLink/BackLink';
import { PhaseBanner } from '../../components/PhaseBanner/PhaseBanner';
import { ServiceNavigation } from '../../components/ServiceNavigation/ServiceNavigation';

const meta = {
  title: 'Patterns/Page template',
  component: PageTemplate,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `The basic structure of every page: skip link, GOV.UK header, optional service navigation and phase banner, a width-constrained \`<main>\` wrapper targeted by the skip link, and the footer. Compose every screen of a service inside this template.

[GOV.UK Design System: Page template](https://design-system.service.gov.uk/styles/page-template/)`,
      },
    },
  },
} satisfies Meta<typeof PageTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

const content = (
  <div className="govuk-grid-row">
    <div className="govuk-grid-column-two-thirds">
      <h1 className="govuk-heading-xl">Page heading</h1>
      <p className="govuk-body">
        The main content of the page goes here, inside the main wrapper so the skip link works.
      </p>
    </div>
  </div>
);

export const Default: Story = {
  args: { children: content },
};

export const FullService: Story = {
  args: {
    children: content,
    serviceNavigation: (
      <ServiceNavigation
        serviceName="Apply for a juggling licence"
        serviceUrl="#"
        items={[
          { children: 'Apply', href: '#', current: true },
          { children: 'Track an application', href: '#' },
        ]}
      />
    ),
    phaseBanner: (
      <PhaseBanner tag="Beta">
        This is a new service – your{' '}
        <a className="govuk-link" href="#">
          feedback
        </a>{' '}
        will help us to improve it.
      </PhaseBanner>
    ),
    beforeContent: <BackLink href="#" />,
  },
};
