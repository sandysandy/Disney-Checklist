import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    docs: {
      description: {
        component: `Use the pagination component to help users navigate forwards and backwards through a series of pages — for example, search results or guidance split across several pages.

Use numbered pagination for navigating a list of results. Use the block-level variant (previous/next only, with optional labels) for navigating between content pages in a sequence. Do not use pagination as a way to break up long form journeys — split the form across separate question pages instead.

[GOV.UK Design System: Pagination](https://design-system.service.gov.uk/components/pagination/)`,
      },
    },
  },
  argTypes: {
    'aria-label': { control: 'text' },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    previous: { href: '#' },
    next: { href: '#' },
    items: [
      { number: 1, href: '#' },
      { number: 2, href: '#', current: true },
      { number: 3, href: '#' },
    ],
  },
};

export const FirstPage: Story = {
  args: {
    next: { href: '#' },
    items: [
      { number: 1, href: '#', current: true },
      { number: 2, href: '#' },
      { number: 3, href: '#' },
    ],
  },
  parameters: {
    docs: {
      description: { story: 'Do not show the previous link on the first page.' },
    },
  },
};

export const LastPage: Story = {
  args: {
    previous: { href: '#' },
    items: [
      { number: 1, href: '#' },
      { number: 2, href: '#' },
      { number: 3, href: '#', current: true },
    ],
  },
  parameters: {
    docs: {
      description: { story: 'Do not show the next link on the last page.' },
    },
  },
};

export const WithEllipses: Story = {
  args: {
    previous: { href: '#' },
    next: { href: '#' },
    items: [
      { number: 1, href: '#' },
      { ellipsis: true },
      { number: 6, href: '#' },
      { number: 7, href: '#', current: true },
      { number: 8, href: '#' },
      { ellipsis: true },
      { number: 42, href: '#' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'For long lists, show the first and last pages and the pages around the current one, skipping the rest with ellipses.',
      },
    },
  },
};

export const BlockLevel: Story = {
  args: {
    previous: { href: '#', labelText: 'Applying for a provisional lorry or bus licence' },
    next: { href: '#', labelText: 'Driver CPC part 1 test: theory' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Block-level pagination for navigating between pages in a sequence, with labels showing where each link leads.',
      },
    },
  },
};

export const BlockLevelWithoutLabels: Story = {
  args: {
    previous: { href: '#' },
    next: { href: '#' },
  },
};

export const CustomLinkText: Story = {
  args: {
    previous: { href: '#', children: 'Previous application' },
    next: { href: '#', children: 'Next application' },
    'aria-label': 'Applications',
  },
};
