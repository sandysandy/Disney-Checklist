import type { Meta, StoryObj } from '@storybook/react-vite';
import { Details } from './Details';

const meta = {
  title: 'Components/Details',
  component: Details,
  parameters: {
    docs: {
      description: {
        component: `Use the details component to make a page easier to scan when it contains information that only some users will need, letting them reveal it only if they want to.

**When not to use:** do not use details to hide information that the majority of your users will need, and do not use it to hide error messages or important warnings. For content split into multiple sections, consider the accordion or tabs components instead.

[GOV.UK Design System: Details](https://design-system.service.gov.uk/components/details/)`,
      },
    },
  },
  argTypes: {
    summary: { control: 'text' },
    open: { control: 'boolean' },
  },
  args: {
    summary: 'Help with nationality',
    children:
      'We need to know your nationality so we can work out which elections you’re entitled to vote in. If you cannot provide your nationality, you’ll have to send copies of identity documents through the post.',
  },
} satisfies Meta<typeof Details>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Expanded: Story = {
  args: { open: true },
  parameters: {
    docs: {
      description: {
        story: 'Use the native `open` attribute to render the details expanded.',
      },
    },
  },
};
