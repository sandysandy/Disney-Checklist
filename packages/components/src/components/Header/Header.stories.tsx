import type { Meta, StoryObj } from '@storybook/react-vite';
import { Header } from './Header';

const meta = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Use the GOV.UK header at the top of every page on a GOV.UK service. It shows users they are using a GOV.UK service.

From govuk-frontend v6 the header only contains the GOV.UK logo (with an optional product name) — show your service name and navigation with the service navigation component, placed directly below the header.

**When not to use:** if your service is not on GOV.UK, do not use the GOV.UK header or the crown logo.

[GOV.UK Design System: Header](https://design-system.service.gov.uk/components/header/)`,
      },
    },
  },
  argTypes: {
    homepageUrl: { control: 'text' },
    productName: { control: 'text' },
    containerClassName: { control: 'text' },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithProductName: Story = {
  args: {
    productName: 'Product',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the product name for products and tools that are part of GOV.UK.',
      },
    },
  },
};

export const FullWidth: Story = {
  args: {
    containerClassName: 'govuk-header__container--full-width',
  },
  parameters: {
    docs: {
      description: { story: 'A full-width header for admin tools and dashboards.' },
    },
  },
};
