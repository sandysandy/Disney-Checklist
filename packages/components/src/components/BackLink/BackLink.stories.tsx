import type { Meta, StoryObj } from '@storybook/react-vite';
import { BackLink } from './BackLink';

const meta = {
  title: 'Components/Back link',
  component: BackLink,
  parameters: {
    docs: {
      description: {
        component: `Use the back link component to help users go back to the previous page in a multi-page transaction. Place it at the top of the page, above the page heading.

**When not to use:** to let users go back to a page they chose from search results or a list — and always make sure the link takes them back to the page they expect, with the information they previously entered still present.

[GOV.UK Design System: Back link](https://design-system.service.gov.uk/components/back-link/)`,
      },
    },
  },
  argTypes: {
    children: { control: 'text' },
    href: { control: 'text' },
    inverse: { control: 'boolean' },
  },
} satisfies Meta<typeof BackLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomText: Story = {
  args: { children: 'Back to civil service jobs' },
};

export const Inverse: Story = {
  args: { inverse: true },
  globals: { backgrounds: { value: 'dark' } },
  parameters: {
    docs: {
      description: { story: 'Use the inverse back link on dark backgrounds.' },
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
