import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from './Breadcrumbs';

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    docs: {
      description: {
        component: `Use the breadcrumbs component to help users understand where they are in a website's structure and move between levels.

**When not to use:** on services with a step-by-step structure — use the back link instead. Avoid using breadcrumbs and a back link together. Consider hiding the breadcrumb for the current page on mobile if it makes the breadcrumb wrap onto two lines.

[GOV.UK Design System: Breadcrumbs](https://design-system.service.gov.uk/components/breadcrumbs/)`,
      },
    },
  },
  argTypes: {
    collapseOnMobile: { control: 'boolean' },
    inverse: { control: 'boolean' },
    'aria-label': { control: 'text' },
  },
  args: {
    items: [
      { children: 'Home', href: '#' },
      { children: 'Passports, travel and living abroad', href: '#' },
      { children: 'Travel abroad', href: '#' },
    ],
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCurrentPage: Story = {
  args: {
    items: [
      { children: 'Home', href: '#' },
      { children: 'Passports, travel and living abroad', href: '#' },
      { children: 'Travel abroad' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'The last item has no `href`, so it is marked as the current page.',
      },
    },
  },
};

export const CollapseOnMobile: Story = {
  args: {
    collapseOnMobile: true,
    items: [
      { children: 'Home', href: '#' },
      { children: 'Environment', href: '#' },
      { children: 'Rural and countryside', href: '#' },
      { children: 'Rural development and land management', href: '#' },
      { children: 'Economic growth in rural areas', href: '#' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'On mobile, only the first and last items are shown to save space.',
      },
    },
  },
};

export const Inverse: Story = {
  args: { inverse: true },
  globals: { backgrounds: { value: 'dark' } },
  parameters: {
    docs: {
      description: { story: 'Use the inverse breadcrumbs on dark backgrounds.' },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ background: '#1d70b8', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};
