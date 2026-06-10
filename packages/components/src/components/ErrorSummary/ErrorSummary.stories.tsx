import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextInput } from '../TextInput/TextInput';
import { ErrorSummary } from './ErrorSummary';

const meta = {
  title: 'Components/Error summary',
  component: ErrorSummary,
  parameters: {
    docs: {
      description: {
        component: `Use the error summary at the top of a page to summarise any mistakes a user has made, linking to each field with a problem. When a user makes an error, you must show both an error summary and an error message next to each answer that contains an error.

**When not to use:** do not show an error summary when there are no errors, and do not use it for success messages — use the notification banner instead. Moving focus to the summary on mount means screen reader users hear the errors immediately.

[GOV.UK Design System: Error summary](https://design-system.service.gov.uk/components/error-summary/)`,
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    disableAutoFocus: { control: 'boolean' },
  },
  args: {
    errors: [
      { targetId: 'full-name-input', message: 'Enter your full name' },
      {
        targetId: 'passport-issued-input',
        message: 'The date your passport was issued must be in the past',
      },
    ],
    // Keep the canvas usable while browsing stories.
    disableAutoFocus: true,
  },
} satisfies Meta<typeof ErrorSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    title: 'There is a problem',
    description: 'The file could not be uploaded.',
    errors: [{ targetId: 'file-upload-input', message: 'The CSV must be smaller than 2MB' }],
  },
};

export const WithoutLinks: Story = {
  args: {
    errors: [{ message: 'You must accept the terms and conditions to continue' }],
  },
  parameters: {
    docs: {
      description: {
        story: 'Errors without a `targetId` or `href` render as plain list items.',
      },
    },
  },
};

export const LinkedToInputs: Story = {
  render: (args) => (
    <>
      <ErrorSummary {...args} />
      <TextInput
        id="full-name-input"
        name="full-name"
        label="Full name"
        errorMessage="Enter your full name"
      />
    </>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Clicking an error link scrolls the field’s label or legend into view and moves focus to the field.',
      },
    },
  },
};
