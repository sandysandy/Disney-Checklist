import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component: `Use the textarea component when you need to let users enter an amount of text that's longer than a single line.

**When not to use:** for single-line answers use a [text input]; to limit the length of an answer, use the [character count] component. Make the textarea the right size for the expected answer using \`rows\`.

[GOV.UK Design System: Textarea](https://design-system.service.gov.uk/components/textarea/)`,
      },
    },
  },
  argTypes: {
    labelSize: { control: 'radio', options: [undefined, 's', 'm', 'l', 'xl'] },
    rows: { control: 'number' },
  },
  args: {
    label: 'Can you provide more detail?',
    name: 'more-detail',
    hint: 'Do not include personal or financial information, like your National Insurance number or credit card details',
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AsPageHeading: Story = {
  args: {
    labelIsPageHeading: true,
    labelSize: 'l',
  },
};

export const WithMoreRows: Story = {
  args: {
    label: 'How would you describe the smell?',
    name: 'smell-description',
    hint: undefined,
    rows: 8,
  },
};

export const WithError: Story = {
  args: {
    label: 'Describe the nature of your event',
    name: 'event-description',
    hint: undefined,
    errorMessage: 'Enter more detail about the event',
  },
};
