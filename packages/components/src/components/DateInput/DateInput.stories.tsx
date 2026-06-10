import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateInput } from './DateInput';

const meta = {
  title: 'Components/Date input',
  component: DateInput,
  parameters: {
    docs: {
      description: {
        component: `Use the date input component to help users enter a memorable date or one they can easily look up, such as a date of birth or passport issue date.

**When not to use:** for dates users may need to look up in a calendar (like appointment bookings) consider a different approach. Accept dates written in different formats and do not autoadvance between fields.

[GOV.UK Design System: Date input](https://design-system.service.gov.uk/components/date-input/)`,
      },
    },
  },
  argTypes: {
    legendSize: { control: 'radio', options: [undefined, 's', 'm', 'l', 'xl'] },
  },
  args: {
    legend: 'When was your passport issued?',
    legendSize: 'l',
    legendIsPageHeading: true,
    hint: 'For example, 27 3 2007',
    namePrefix: 'passport-issued',
    id: 'passport-issued',
  },
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DateOfBirth: Story = {
  args: {
    legend: 'What is your date of birth?',
    hint: 'For example, 31 3 1980',
    namePrefix: 'date-of-birth',
    id: 'date-of-birth',
    autocomplete: { day: 'bday-day', month: 'bday-month', year: 'bday-year' },
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the `bday-*` autocomplete attributes when asking for a date of birth.',
      },
    },
  },
};

export const WithErrorOnWholeDate: Story = {
  args: {
    errorMessage: 'The date your passport was issued must be in the past',
    values: { day: '6', month: '3', year: '2076' },
  },
};

export const WithErrorOnSingleField: Story = {
  args: {
    errorMessage: 'The date your passport was issued must include a year',
    errorFields: ['year'],
    values: { day: '6', month: '3', year: '' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'If you know which part of the date is wrong, only highlight that field with `errorFields`.',
      },
    },
  },
};
