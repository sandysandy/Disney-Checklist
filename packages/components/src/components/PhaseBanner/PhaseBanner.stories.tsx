import type { Meta, StoryObj } from '@storybook/react-vite';
import { PhaseBanner } from './PhaseBanner';

const meta = {
  title: 'Components/Phase banner',
  component: PhaseBanner,
  parameters: {
    docs: {
      description: {
        component: `Use the phase banner component to show users your service is still being worked on. Services in alpha or beta must use a phase banner, placed directly under the header or service navigation.

**When not to use:** do not use a phase banner once your service is live.

[GOV.UK Design System: Phase banner](https://design-system.service.gov.uk/components/phase-banner/)`,
      },
    },
  },
  argTypes: {
    tag: { control: 'text' },
    tagColour: {
      control: 'select',
      options: [
        undefined,
        'grey',
        'green',
        'turquoise',
        'blue',
        'light-blue',
        'purple',
        'pink',
        'red',
        'orange',
        'yellow',
      ],
    },
  },
  args: {
    tag: 'Beta',
    children: (
      <>
        This is a new service. Help us improve it and{' '}
        <a className="govuk-link" href="#feedback">
          give your feedback by email
        </a>
        .
      </>
    ),
  },
} satisfies Meta<typeof PhaseBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Beta: Story = {};

export const Alpha: Story = {
  args: { tag: 'Alpha' },
};
