import type { Meta, StoryObj } from '@storybook/react-vite';
import { WarningText } from './WarningText';

const meta = {
  title: 'Components/Warning text',
  component: WarningText,
  parameters: {
    docs: {
      description: {
        component: `Use the warning text component when you need to warn users about something important, such as legal consequences of an action, or lack of action, that they might take.

**When not to use:** do not use warning text for general or low-priority information — use inset text or body copy instead, and use it sparingly so it keeps its impact.

[GOV.UK Design System: Warning text](https://design-system.service.gov.uk/components/warning-text/)`,
      },
    },
  },
  argTypes: {
    iconFallbackText: {
      control: 'text',
      description: 'Visually hidden text announced in place of the "!" icon',
    },
  },
  args: {
    children: 'You can be fined up to £5,000 if you do not register.',
  },
} satisfies Meta<typeof WarningText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
