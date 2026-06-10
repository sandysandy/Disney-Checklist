import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckYourAnswers } from './CheckYourAnswers';
import { PageTemplate } from '../PageTemplate/PageTemplate';

const meta = {
  title: 'Patterns/Check your answers',
  component: CheckYourAnswers,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Let users check and change their answers before they submit. Every row needs a "Change" link with visually hidden text naming the answer, so screen reader users know what each link changes.

[GOV.UK Design System: Check answers](https://design-system.service.gov.uk/patterns/check-answers/)`,
      },
    },
  },
  decorators: [
    (Story) => (
      <PageTemplate>
        <Story />
      </PageTemplate>
    ),
  ],
} satisfies Meta<typeof CheckYourAnswers>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sections: [
      {
        heading: 'Personal details',
        rows: [
          {
            key: 'Name',
            value: 'Sarah Philips',
            actions: [{ href: '#', children: 'Change', visuallyHiddenText: 'name' }],
          },
          {
            key: 'Where you live',
            value: 'England',
            actions: [{ href: '#', children: 'Change', visuallyHiddenText: 'where you live' }],
          },
        ],
      },
      {
        heading: 'Application details',
        rows: [
          {
            key: 'How many balls can you juggle?',
            value: '3 or more',
            actions: [
              {
                href: '#',
                children: 'Change',
                visuallyHiddenText: 'how many balls you can juggle',
              },
            ],
          },
          {
            key: 'Tell us about your best juggling trick',
            value: 'Standing on one leg behind the back',
            actions: [
              { href: '#', children: 'Change', visuallyHiddenText: 'your best juggling trick' },
            ],
          },
        ],
      },
    ],
  },
};
