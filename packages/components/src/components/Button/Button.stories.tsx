import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: `Use the button component to help users carry out an action like starting an application or saving their information.

**When to use:** for the main call to action on a page. Align the primary action button to the left edge of your form.

**When not to use:** for navigation between pages — use a link instead. Write button text in sentence case, describing the action it performs.

[GOV.UK Design System: Button](https://design-system.service.gov.uk/components/button/)`,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['default', 'secondary', 'warning', 'inverse'],
      description: 'Visual variant matching the GOV.UK modifier classes',
    },
    isStartButton: { control: 'boolean' },
    disabled: { control: 'boolean' },
    preventDoubleClick: { control: 'boolean' },
    href: { control: 'text' },
  },
  args: {
    children: 'Save and continue',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Find address' },
};

export const Warning: Story = {
  args: { variant: 'warning', children: 'Delete account' },
};

export const Start: Story = {
  args: { isStartButton: true, children: 'Start now', href: '#' },
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: {
    docs: {
      description: {
        story:
          'Disabled buttons have poor contrast and can confuse users — only use them if research shows it makes the interface easier to understand.',
      },
    },
  },
};

export const AsLink: Story = {
  args: { href: '#', children: 'Continue' },
};

export const PreventDoubleClick: Story = {
  args: { preventDoubleClick: true, children: 'Confirm and send' },
};

export const Inverse: Story = {
  args: { variant: 'inverse', children: 'Continue' },
  globals: { backgrounds: { value: 'dark' } },
  parameters: {
    docs: {
      description: { story: 'Use inverse buttons on dark backgrounds.' },
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
