import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radios } from './Radios';
import { TextInput } from '../TextInput/TextInput';

const meta = {
  title: 'Components/Radios',
  component: Radios,
  parameters: {
    docs: {
      description: {
        component: `Use the radios component when users can only select one option from a list.

**When not to use:** if users might need to select more than one option, use the [checkboxes] component instead. Order options alphabetically by default, or by most-frequently selected if research shows a clear preference. Include "or" dividers and a "None of the above" style option where it helps users answer accurately.

[GOV.UK Design System: Radios](https://design-system.service.gov.uk/components/radios/)`,
      },
    },
  },
  argTypes: {
    legendSize: { control: 'radio', options: [undefined, 's', 'm', 'l', 'xl'] },
    small: { control: 'boolean' },
    inline: { control: 'boolean' },
  },
  args: {
    name: 'where-do-you-live',
    legend: 'Where do you live?',
    legendSize: 'l',
    legendIsPageHeading: true,
    items: [
      { value: 'england', label: 'England' },
      { value: 'scotland', label: 'Scotland' },
      { value: 'wales', label: 'Wales' },
      { value: 'northern-ireland', label: 'Northern Ireland' },
    ],
  },
} satisfies Meta<typeof Radios>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Inline: Story = {
  args: {
    name: 'changed-name',
    legend: 'Have you changed your name?',
    hint: 'This includes changing your last name or spelling your name differently.',
    inline: true,
    items: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Only use inline radios when there are two options that fit side by side.',
      },
    },
  },
};

export const WithHints: Story = {
  args: {
    name: 'sign-in',
    legend: 'How do you want to sign in?',
    hint: 'You’ll need an account to prove your identity and complete your self assessment.',
    items: [
      {
        value: 'government-gateway',
        label: 'Sign in with Government Gateway',
        hint: 'You’ll have a user ID if you’ve registered for self assessment or filed a tax return online before.',
      },
      {
        value: 'govuk-one-login',
        label: 'Sign in with GOV.UK One Login',
        hint: 'If you don’t have a GOV.UK One Login, you can create one.',
      },
    ],
  },
};

export const WithDivider: Story = {
  args: {
    items: [
      { value: 'england', label: 'England' },
      { value: 'scotland', label: 'Scotland' },
      { value: 'wales', label: 'Wales' },
      { value: 'northern-ireland', label: 'Northern Ireland' },
      { divider: 'or' },
      { value: 'abroad', label: 'I am a British citizen living abroad' },
    ],
  },
};

export const ConditionalReveal: Story = {
  args: {
    name: 'contact',
    legend: 'How would you prefer to be contacted?',
    hint: 'Select one option.',
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
  parameters: {
    docs: {
      description: {
        story:
          'Reveal a follow-up question conditionally when its radio is selected. Keep it to a single related question.',
      },
    },
  },
};

export const Small: Story = {
  args: {
    name: 'filter',
    legend: 'Filter',
    legendSize: 'm',
    legendIsPageHeading: false,
    small: true,
    items: [
      { value: 'month', label: 'Monthly' },
      { value: 'year', label: 'Yearly' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Use small radios on pages with lots of dense content, such as search filters.',
      },
    },
  },
};

export const WithError: Story = {
  args: {
    name: 'changed-name',
    legend: 'Have you changed your name?',
    hint: 'This includes changing your last name or spelling your name differently.',
    errorMessage: 'Select yes if you have changed your name',
    inline: true,
    items: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      { value: 'england', label: 'England' },
      { value: 'scotland', label: 'Scotland' },
      { value: 'wales', label: 'Wales' },
      { value: 'northern-ireland', label: 'Northern Ireland', disabled: true },
    ],
  },
};
