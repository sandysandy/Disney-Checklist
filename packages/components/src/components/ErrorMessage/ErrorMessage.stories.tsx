import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorMessage } from './ErrorMessage';

const meta = {
  title: 'Components/Error message',
  component: ErrorMessage,
  parameters: {
    docs: {
      description: {
        component: `Show an error message next to the field and in the error summary when there is a validation error. Use clear language describing what went wrong and how to fix it.

Style guide: do not use "please" or "sorry"; be specific, e.g. "Enter your first name".

[GOV.UK Design System: Error message](https://design-system.service.gov.uk/components/error-message/)`,
      },
    },
  },
  args: {
    children: 'Enter your full name',
  },
} satisfies Meta<typeof ErrorMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomVisuallyHiddenText: Story = {
  args: { visuallyHiddenText: 'Gwall' },
  parameters: {
    docs: {
      description: {
        story: 'Override the visually hidden "Error" prefix, e.g. for Welsh-language services.',
      },
    },
  },
};
