import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    docs: {
      description: {
        component: `The select component should only be used as a last resort in public-facing services because research shows some users find selects very difficult to use.

**When not to use:** try asking the question in a different way — radios, or a text input with autocomplete, are usually better. Watch out for selects with many options, very similar options, or options users don't understand.

[GOV.UK Design System: Select](https://design-system.service.gov.uk/components/select/)`,
      },
    },
  },
  argTypes: {
    labelSize: { control: 'radio', options: [undefined, 's', 'm', 'l', 'xl'] },
    fullWidth: { control: 'boolean' },
  },
  args: {
    label: 'Sort by',
    name: 'sort',
    items: [
      { value: 'published', label: 'Recently published' },
      { value: 'updated', label: 'Recently updated' },
      { value: 'views', label: 'Most views' },
      { value: 'comments', label: 'Most comments' },
    ],
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDefaultSelected: Story = {
  args: {
    defaultValue: 'updated',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Choose location',
    name: 'location',
    hint: 'This can be different to where you went before',
    items: [
      { value: 'choose', label: 'Choose location' },
      { value: 'eastmidlands', label: 'East Midlands' },
      { value: 'eastofengland', label: 'East of England' },
      { value: 'london', label: 'London' },
      { value: 'northeast', label: 'North East' },
    ],
  },
};

export const WithError: Story = {
  args: {
    label: 'Choose location',
    name: 'location',
    hint: 'This can be different to where you went before',
    errorMessage: 'Select a location',
    items: [
      { value: 'choose', label: 'Choose location' },
      { value: 'eastmidlands', label: 'East Midlands' },
      { value: 'eastofengland', label: 'East of England' },
    ],
  },
};

export const WithDisabledOption: Story = {
  args: {
    items: [
      { value: 'published', label: 'Recently published' },
      { value: 'updated', label: 'Recently updated', disabled: true },
      { value: 'views', label: 'Most views' },
    ],
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
  },
};
