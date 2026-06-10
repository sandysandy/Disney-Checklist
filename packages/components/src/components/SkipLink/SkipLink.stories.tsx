import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkipLink } from './SkipLink';

const meta = {
  title: 'Components/Skip link',
  component: SkipLink,
  parameters: {
    docs: {
      description: {
        component: `Use the skip link component to help keyboard-only users skip to the main content on a page. All GOV.UK pages must include a skip link as the first interactive element, before the header.

The link is visually hidden until it receives keyboard focus. On activation it moves focus to the main content container, so the user does not have to tab through the header and navigation again.

[GOV.UK Design System: Skip link](https://design-system.service.gov.uk/components/skip-link/)`,
      },
    },
  },
  argTypes: {
    children: { control: 'text' },
    href: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <main id="content" className="govuk-body">
          <p>Press Tab to reveal the skip link, then Enter to focus this main content.</p>
        </main>
      </>
    ),
  ],
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomText: Story = {
  args: {
    children: 'Skip to the main content of this page',
  },
};
