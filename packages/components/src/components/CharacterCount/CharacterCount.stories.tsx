import type { Meta, StoryObj } from '@storybook/react-vite';
import { CharacterCount } from './CharacterCount';

const meta = {
  title: 'Components/Character count',
  component: CharacterCount,
  parameters: {
    docs: {
      description: {
        component: `Use the character count component to tell users how many characters or words they can enter into a textarea, as they type.

**When to use:** only when there is a good reason for limiting the answer, such as a hard backend limit or evidence that users find a limit helpful. Always test the limit with users, and prefer character limits over word limits.

[GOV.UK Design System: Character count](https://design-system.service.gov.uk/components/character-count/)`,
      },
    },
  },
  argTypes: {
    labelSize: { control: 'radio', options: [undefined, 's', 'm', 'l', 'xl'] },
    maxLength: { control: 'number' },
    maxWords: { control: 'number' },
    threshold: { control: 'number' },
  },
  args: {
    label: 'Can you provide more detail?',
    name: 'more-detail',
    hint: 'Do not include personal or financial information like your National Insurance number or credit card details',
    maxLength: 200,
    labelIsPageHeading: true,
    labelSize: 'l',
  },
} satisfies Meta<typeof CharacterCount>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WordCount: Story = {
  args: {
    label: 'Enter a job description',
    name: 'job-description',
    hint: undefined,
    maxLength: undefined,
    maxWords: 150,
  },
};

export const WithThreshold: Story = {
  args: {
    label: 'Can you provide more detail?',
    hint: undefined,
    maxLength: 112,
    threshold: 75,
    defaultValue:
      'Type another character to see the threshold message appear once 75% of the limit is reache',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `threshold` to only show the count message once users have entered a percentage of the limit.',
      },
    },
  },
};

export const WithError: Story = {
  args: {
    label: 'Enter a job description',
    name: 'job-description',
    hint: undefined,
    maxLength: 350,
    errorMessage: 'Job description must be 350 characters or less',
    defaultValue:
      'A content designer works on the end-to-end journey of a service to help users complete their goal and government deliver a policy intent. Their work may involve the creation of, or change to, a transaction, product or single piece of content that stretches across digital and offline channels. They make sure appropriate content is shown to a user in the right place and in the best format.',
  },
};

export const Translated: Story = {
  args: {
    label: 'Allwch chi ddarparu mwy o fanylion?',
    hint: undefined,
    maxLength: 200,
    charactersUnderLimitText: {
      one: 'Mae gennych %{count} nod ar ôl',
      other: 'Mae gennych %{count} o nodau ar ôl',
    },
    charactersAtLimitText: 'Mae gennych 0 o nodau ar ôl',
    charactersOverLimitText: {
      one: 'Mae gennych %{count} nod yn ormod',
      other: 'Mae gennych %{count} o nodau yn ormod',
    },
    textareaDescriptionText: 'Gallwch nodi hyd at %{count} o nodau',
  },
  parameters: {
    docs: {
      description: {
        story: 'All count messages can be translated via the i18n props.',
      },
    },
  },
};
