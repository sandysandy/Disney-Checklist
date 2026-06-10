import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExitThisPage } from './ExitThisPage';

const meta = {
  title: 'Components/Exit this page',
  component: ExitThisPage,
  parameters: {
    docs: {
      description: {
        component: `Give users a way to quickly and safely leave a page containing sensitive information, such as services for victims of domestic abuse. The button (or pressing **Shift three times**) immediately replaces the page content and redirects — try the shortcut in the canvas.

**When to use:** any page with information that could put someone at risk if another person saw it. Pair it with guidance on covering your tracks online, as it does not clear browser history.

[GOV.UK Design System: Exit this page](https://design-system.service.gov.uk/components/exit-this-page/)`,
      },
    },
  },
  argTypes: {
    redirectUrl: { control: 'text' },
    activatedText: { control: 'text' },
    timedOutText: { control: 'text' },
    pressTwoMoreTimesText: { control: 'text' },
    pressOneMoreTimeText: { control: 'text' },
  },
  args: {
    // Keep the canvas usable: stories do not really navigate away.
    navigate: () => {},
  },
} satisfies Meta<typeof ExitThisPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomRedirect: Story = {
  args: { redirectUrl: 'https://www.google.co.uk' },
};
