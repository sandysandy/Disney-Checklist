import type { Meta, StoryObj } from '@storybook/react-vite';
import { QuestionPage } from './QuestionPage';
import { BackLink } from '../../components/BackLink/BackLink';
import { Radios } from '../../components/Radios/Radios';
import { TextInput } from '../../components/TextInput/TextInput';
import { PageTemplate } from '../PageTemplate/PageTemplate';

const meta = {
  title: 'Patterns/Question page',
  component: QuestionPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Ask one thing per page. The question is the page heading (via \`labelIsPageHeading\` / \`legendIsPageHeading\`), the content sits in a two-thirds column, and on a failed submission the error summary appears above the question, takes focus, and links to each field.

[GOV.UK Design System: Question pages](https://design-system.service.gov.uk/patterns/question-pages/)`,
      },
    },
  },
  decorators: [
    (Story) => (
      <PageTemplate beforeContent={<BackLink href="#" />}>
        <Story />
      </PageTemplate>
    ),
  ],
} satisfies Meta<typeof QuestionPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextQuestion: Story = {
  args: {
    caption: 'Apply for a juggling licence',
    children: (
      <TextInput
        label="What is your full name?"
        labelIsPageHeading
        labelSize="l"
        name="full-name"
        autoComplete="name"
      />
    ),
  },
};

export const RadiosQuestion: Story = {
  args: {
    children: (
      <Radios
        name="where-do-you-live"
        legend="Where do you live?"
        legendIsPageHeading
        legendSize="l"
        items={[
          { value: 'england', label: 'England' },
          { value: 'scotland', label: 'Scotland' },
          { value: 'wales', label: 'Wales' },
          { value: 'northern-ireland', label: 'Northern Ireland' },
        ]}
      />
    ),
  },
};

export const WithErrors: Story = {
  args: {
    errors: [{ targetId: 'full-name', message: 'Enter your full name' }],
    children: (
      <TextInput
        id="full-name"
        label="What is your full name?"
        labelIsPageHeading
        labelSize="l"
        name="full-name"
        errorMessage="Enter your full name"
        autoComplete="name"
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'The failed-validation state: the error summary receives focus on mount and its link moves focus to the field.',
      },
    },
  },
};
