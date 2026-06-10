import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table } from './Table';

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component: `Use the table component to make information easier to compare and scan for users.

**When not to use:** never use tables to layout content on a page — use the grid system instead. Use a caption to describe the table, header cells so the contents can be understood by screen reader users, and right-align numeric columns (\`format: 'numeric'\`) so the digits line up.

[GOV.UK Design System: Table](https://design-system.service.gov.uk/components/table/)`,
      },
    },
  },
  argTypes: {
    captionSize: { control: 'radio', options: [undefined, 'm', 'l', 'xl'] },
    firstCellIsHeader: { control: 'boolean' },
    smallTextUntilTablet: { control: 'boolean' },
  },
  args: {
    caption: 'Dates and amounts',
    captionSize: 'm',
    head: [{ children: 'Date' }, { children: 'Amount' }],
    rows: [
      [{ children: 'First 6 weeks' }, { children: '£109.80 per week' }],
      [{ children: 'Next 33 weeks' }, { children: '£109.80 per week' }],
      [{ children: 'Total estimated pay' }, { children: '£4,282.20' }],
    ],
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCaptionSizes: Story = {
  args: {
    caption: 'Months and rates',
    captionSize: 'l',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Style captions like headings with `captionSize` (`m`, `l` or `xl`) to suit the importance of the table.',
      },
    },
  },
};

export const NumericColumns: Story = {
  args: {
    caption: 'Monthly running costs',
    head: [
      { children: 'Month you apply' },
      { children: 'Rate for bicycles', format: 'numeric' },
      { children: 'Rate for vehicles', format: 'numeric' },
    ],
    rows: [
      [
        { children: 'January' },
        { children: '£85', format: 'numeric' },
        { children: '£95', format: 'numeric' },
      ],
      [
        { children: 'February' },
        { children: '£75', format: 'numeric' },
        { children: '£55', format: 'numeric' },
      ],
      [
        { children: 'March' },
        { children: '£165', format: 'numeric' },
        { children: '£125', format: 'numeric' },
      ],
    ],
  },
};

export const FirstCellIsHeader: Story = {
  args: {
    caption: 'Monthly running costs',
    firstCellIsHeader: true,
    head: [
      { children: 'Month you apply' },
      { children: 'Rate for bicycles', format: 'numeric' },
      { children: 'Rate for vehicles', format: 'numeric' },
    ],
    rows: [
      [
        { children: 'January' },
        { children: '£85', format: 'numeric' },
        { children: '£95', format: 'numeric' },
      ],
      [
        { children: 'February' },
        { children: '£75', format: 'numeric' },
        { children: '£55', format: 'numeric' },
      ],
      [
        { children: 'March' },
        { children: '£165', format: 'numeric' },
        { children: '£125', format: 'numeric' },
      ],
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'If the first cell in each row is also a header for that row, set `firstCellIsHeader` so it renders as `<th scope="row">`.',
      },
    },
  },
};

export const SmallTextUntilTablet: Story = {
  args: {
    smallTextUntilTablet: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'For tables with a lot of data, `smallTextUntilTablet` applies the `govuk-table--small-text-until-tablet` modifier so more fits on small screens.',
      },
    },
  },
};

export const WithColumnSpans: Story = {
  args: {
    caption: 'Spanning cells',
    head: [
      { children: 'Quarter', colSpan: 2 },
      { children: 'Total', format: 'numeric' },
    ],
    rows: [
      [
        { children: 'Q1' },
        { children: 'January to March' },
        { children: '£255', format: 'numeric' },
      ],
      [
        { children: 'Q1 and Q2 combined', colSpan: 2 },
        { children: '£515', format: 'numeric' },
      ],
    ],
  },
};
