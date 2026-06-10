import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fieldset } from './Fieldset';
import { TextInput } from '../TextInput/TextInput';

const meta = {
  title: 'Components/Fieldset',
  component: Fieldset,
  parameters: {
    docs: {
      description: {
        component: `Use the fieldset component to group related form inputs — for example, radios, checkboxes, or several text inputs forming a single answer like an address.

[GOV.UK Design System: Fieldset](https://design-system.service.gov.uk/components/fieldset/)`,
      },
    },
  },
  argTypes: {
    legendSize: { control: 'radio', options: [undefined, 's', 'm', 'l', 'xl'] },
  },
  args: {
    legend: 'What is your address?',
  },
} satisfies Meta<typeof Fieldset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AsPageHeading: Story = {
  args: {
    legend: 'What is your address?',
    legendSize: 'l',
    legendIsPageHeading: true,
    children: (
      <>
        <TextInput label="Address line 1" name="address-line-1" autoComplete="address-line1" />
        <TextInput
          label="Address line 2 (optional)"
          name="address-line-2"
          autoComplete="address-line2"
        />
        <TextInput
          label="Town or city"
          name="address-town"
          width="two-thirds"
          autoComplete="address-level2"
        />
        <TextInput label="Postcode" name="address-postcode" width="10" autoComplete="postal-code" />
      </>
    ),
  },
};
