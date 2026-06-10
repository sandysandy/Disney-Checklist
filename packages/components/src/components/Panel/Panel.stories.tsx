import type { Meta, StoryObj } from '@storybook/react-vite';
import { Panel } from './Panel';

const meta = {
  title: 'Components/Panel',
  component: Panel,
  parameters: {
    docs: {
      description: {
        component: `The panel component is a visible container used on confirmation or results pages to highlight important content, telling users they have successfully completed a transaction.

**When not to use:** do not use the panel to highlight important information within body content — use inset text, warning text or notification banners instead.

[GOV.UK Design System: Panel](https://design-system.service.gov.uk/components/panel/)`,
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    headingLevel: { control: 'select', options: [1, 2, 3, 4, 5, 6] },
  },
  args: {
    title: 'Application complete',
    children: (
      <>
        Your reference number
        <br />
        <strong>HDJ2123F</strong>
      </>
    ),
  },
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TitleOnly: Story = {
  args: { children: undefined },
  parameters: {
    docs: {
      description: {
        story: 'The panel body is optional — omit it when there is no reference to show.',
      },
    },
  },
};
