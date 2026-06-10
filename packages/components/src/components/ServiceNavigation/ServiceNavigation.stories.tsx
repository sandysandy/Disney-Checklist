import type { Meta, StoryObj } from '@storybook/react-vite';
import { ServiceNavigation } from './ServiceNavigation';

const items = [
  { children: 'Navigation item 1', href: '#' },
  { children: 'Navigation item 2', href: '#', active: true },
  { children: 'Navigation item 3', href: '#' },
];

const meta = {
  title: 'Components/Service navigation',
  component: ServiceNavigation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Use the service navigation component to help users understand that they're using your service and let them navigate around it. Place it directly below the GOV.UK header.

On mobile the navigation collapses behind a Menu button. Use it with a service name alone, navigation links alone, or both.

**When not to use:** do not combine it with old-style header navigation; keep top-level navigation to a handful of items.

[GOV.UK Design System: Service navigation](https://design-system.service.gov.uk/components/service-navigation/)`,
      },
    },
  },
  argTypes: {
    serviceName: { control: 'text' },
    serviceUrl: { control: 'text' },
    inverse: { control: 'boolean' },
    collapseNavigationOnMobile: { control: 'boolean' },
    menuButtonText: { control: 'text' },
    navigationLabel: { control: 'text' },
  },
} satisfies Meta<typeof ServiceNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    serviceName: 'Service name',
    serviceUrl: '#',
    items,
  },
};

export const ServiceNameOnly: Story = {
  args: {
    serviceName: 'Service name',
    serviceUrl: '#',
  },
};

export const NavigationOnly: Story = {
  args: {
    items,
  },
};

export const WithCurrentPage: Story = {
  args: {
    serviceName: 'Service name',
    items: [
      { children: 'Navigation item 1', href: '#' },
      { children: 'Navigation item 2', href: '#', current: true },
      { children: 'Navigation item 3', href: '#' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `current` for the page the user is on (`aria-current="page"`) and `active` for a section they are within (`aria-current="true"`).',
      },
    },
  },
};

export const Inverse: Story = {
  args: {
    serviceName: 'Service name',
    items,
    inverse: true,
  },
  parameters: {
    docs: {
      description: { story: 'Use the inverse style on dark page backgrounds.' },
    },
  },
};

export const WithSlots: Story = {
  args: {
    serviceName: 'Service name',
    items,
    startSlot: <p className="govuk-body govuk-!-margin-bottom-0">Start slot</p>,
    endSlot: <p className="govuk-body govuk-!-margin-bottom-0">End slot</p>,
  },
  parameters: {
    docs: {
      description: {
        story: 'Slots let you inject custom content around the service name and navigation.',
      },
    },
  },
};
