import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextInput } from './TextInput';

const meta = {
  title: 'Components/Text input',
  component: TextInput,
  parameters: {
    docs: {
      description: {
        component: `Use the text input component when you need to let users enter text that's no longer than a single line.

**When not to use:** for longer answers use a [textarea]; for known-format values like dates use the date input. Use \`width\` to make the field length hint at the expected answer length.

[GOV.UK Design System: Text input](https://design-system.service.gov.uk/components/text-input/)`,
      },
    },
  },
  argTypes: {
    labelSize: { control: 'radio', options: [undefined, 's', 'm', 'l', 'xl'] },
    width: {
      control: 'select',
      options: [
        undefined,
        'full',
        'three-quarters',
        'two-thirds',
        'one-half',
        'one-third',
        'one-quarter',
        '30',
        '20',
        '10',
        '5',
        '4',
        '3',
        '2',
      ],
    },
  },
  args: {
    label: 'What is the name of the event?',
    name: 'event-name',
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: {
    hint: 'The name you’ll use on promotional material',
  },
};

export const AsPageHeading: Story = {
  args: {
    labelIsPageHeading: true,
    labelSize: 'l',
    hint: 'The name you’ll use on promotional material',
  },
};

export const FixedWidth: Story = {
  args: {
    label: 'What is your National Insurance number?',
    hint: 'It’s on your National Insurance card. For example, ‘QQ 12 34 56 C’.',
    name: 'national-insurance-number',
    width: '10',
  },
};

export const WithPrefixAndSuffix: Story = {
  args: {
    label: 'What is the cost per item, in pounds?',
    name: 'cost-per-item',
    prefix: '£',
    suffix: 'per item',
    width: '5',
    inputMode: 'decimal',
  },
};

export const WithError: Story = {
  args: {
    errorMessage: 'Enter an event name',
    hint: 'The name you’ll use on promotional material',
  },
};

export const Numeric: Story = {
  args: {
    label: 'What is your account number?',
    hint: 'Must be between 6 and 8 digits long',
    name: 'account-number',
    width: '10',
    inputMode: 'numeric',
    pattern: '[0-9]*',
    spellCheck: false,
  },
};
