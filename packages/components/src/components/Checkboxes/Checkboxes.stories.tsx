import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkboxes } from './Checkboxes';
import { TextInput } from '../TextInput/TextInput';

const meta = {
  title: 'Components/Checkboxes',
  component: Checkboxes,
  parameters: {
    docs: {
      description: {
        component: `Use the checkboxes component when you need to help users select multiple options from a list, or toggle a single option on or off.

**When not to use:** if users can only choose one option, use the [radios] component instead. Order options alphabetically by default. Add a "None of the above" exclusive option where users might otherwise skip the question.

[GOV.UK Design System: Checkboxes](https://design-system.service.gov.uk/components/checkboxes/)`,
      },
    },
  },
  argTypes: {
    legendSize: { control: 'radio', options: [undefined, 's', 'm', 'l', 'xl'] },
    small: { control: 'boolean' },
  },
  args: {
    name: 'waste',
    legend: 'Which types of waste do you transport?',
    legendSize: 'l',
    legendIsPageHeading: true,
    hint: 'Select all that apply.',
    items: [
      { value: 'carcasses', label: 'Waste from animal carcasses' },
      { value: 'mines', label: 'Waste from mines or quarries' },
      { value: 'farm', label: 'Farm or agricultural waste' },
    ],
  },
} satisfies Meta<typeof Checkboxes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHints: Story = {
  args: {
    name: 'nationality',
    legend: 'What is your nationality?',
    hint: 'If you have dual nationality, select all options that are relevant to you.',
    items: [
      {
        value: 'british',
        label: 'British',
        hint: 'including English, Scottish, Welsh and Northern Irish',
      },
      { value: 'irish', label: 'Irish' },
      { value: 'other', label: 'Citizen of another country' },
    ],
  },
};

export const NoneOfTheAbove: Story = {
  args: {
    name: 'countries',
    legend: 'Will you be travelling to any of these countries?',
    hint: 'Select all countries that apply.',
    items: [
      { value: 'france', label: 'France' },
      { value: 'portugal', label: 'Portugal' },
      { value: 'spain', label: 'Spain' },
      { divider: 'or' },
      {
        value: 'none',
        label: 'No, I will not be travelling to any of these countries',
        exclusive: true,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Add an exclusive "None of the above" option after an "or" divider. Checking it unchecks the other options, and vice versa.',
      },
    },
  },
};

export const ConditionalReveal: Story = {
  args: {
    name: 'contact',
    legend: 'How would you like to be contacted?',
    hint: 'Select all options that are relevant to you.',
    items: [
      {
        value: 'email',
        label: 'Email',
        conditional: (
          <TextInput
            label="Email address"
            name="contact-by-email"
            type="email"
            spellCheck={false}
            autoComplete="email"
            width="two-thirds"
          />
        ),
      },
      {
        value: 'phone',
        label: 'Phone',
        conditional: (
          <TextInput
            label="Phone number"
            name="contact-by-phone"
            type="tel"
            autoComplete="tel"
            width="two-thirds"
          />
        ),
      },
      {
        value: 'text',
        label: 'Text message',
        conditional: (
          <TextInput
            label="Mobile phone number"
            name="contact-by-text"
            type="tel"
            autoComplete="tel"
            width="two-thirds"
          />
        ),
      },
    ],
  },
};

export const Small: Story = {
  args: {
    name: 'organisation',
    legend: 'Organisation',
    legendSize: 'm',
    legendIsPageHeading: false,
    hint: undefined,
    small: true,
    items: [
      { value: 'hmrc', label: 'HM Revenue and Customs (HMRC)' },
      { value: 'employment-tribunal', label: 'Employment Tribunal' },
      { value: 'mod', label: 'Ministry of Defence' },
      { value: 'dfe', label: 'Department for Education' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Use small checkboxes on pages with lots of dense content, such as search filters.',
      },
    },
  },
};

export const WithError: Story = {
  args: {
    name: 'nationality',
    legend: 'What is your nationality?',
    hint: 'If you have dual nationality, select all options that are relevant to you.',
    errorMessage: 'Select if you are British, Irish or a citizen of a different country',
    items: [
      {
        value: 'british',
        label: 'British',
        hint: 'including English, Scottish, Welsh and Northern Irish',
      },
      { value: 'irish', label: 'Irish' },
      { value: 'other', label: 'Citizen of another country' },
    ],
  },
};

export const SingleCheckbox: Story = {
  args: {
    name: 'organisation-declaration',
    legend: undefined,
    legendIsPageHeading: false,
    hint: undefined,
    items: [{ value: 'agree', label: 'I agree to the terms and conditions' }],
  },
  parameters: {
    docs: {
      description: {
        story: 'Use a single checkbox without a fieldset to let users agree or accept something.',
      },
    },
  },
};
