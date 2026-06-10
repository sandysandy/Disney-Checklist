import type { Meta, StoryObj } from '@storybook/react-vite';
import { SummaryCard, SummaryList } from './SummaryList';

const rows = [
  {
    key: 'Name',
    value: 'Sarah Philips',
    actions: [{ href: '#', children: 'Change', visuallyHiddenText: 'name' }],
  },
  {
    key: 'Date of birth',
    value: '5 January 1978',
    actions: [{ href: '#', children: 'Change', visuallyHiddenText: 'date of birth' }],
  },
  {
    key: 'Address',
    value: (
      <>
        72 Guild Street
        <br />
        London
        <br />
        SE23 6FH
      </>
    ),
    actions: [{ href: '#', children: 'Change', visuallyHiddenText: 'address' }],
  },
  {
    key: 'Contact details',
    value: (
      <>
        <p className="govuk-body">07700 900457</p>
        <p className="govuk-body">sarah.phillips@example.com</p>
      </>
    ),
    actions: [{ href: '#', children: 'Change', visuallyHiddenText: 'contact details' }],
  },
];

const meta = {
  title: 'Components/Summary list',
  component: SummaryList,
  parameters: {
    docs: {
      description: {
        component: `Use the summary list component to summarise information, for example a user's responses at the end of a form — the heart of the "Check your answers" pattern.

**When not to use:** do not use it to display tabular data (use a table) or content that is not key/value pairs. Add "Change" action links so users can go back and edit their answers; give each link visually hidden text so screen reader users know what they will be changing. Use \`SummaryCard\` to group related summary lists with a title and card-level actions.

[GOV.UK Design System: Summary list](https://design-system.service.gov.uk/components/summary-list/)`,
      },
    },
  },
  argTypes: {
    noBorder: { control: 'boolean' },
  },
  args: {
    rows,
  },
} satisfies Meta<typeof SummaryList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutActions: Story = {
  args: {
    rows: rows.map(({ key, value }) => ({ key, value })),
  },
};

export const WithoutBorders: Story = {
  args: {
    noBorder: true,
    rows: rows.map(({ key, value }) => ({ key, value })),
  },
  parameters: {
    docs: {
      description: {
        story: 'Remove borders with `noBorder` when you do not need to visually separate rows.',
      },
    },
  },
};

export const MixedRowsWithAndWithoutActions: Story = {
  args: {
    rows: [rows[0], { key: 'Date of birth', value: '5 January 1978' }, rows[2]],
  },
  parameters: {
    docs: {
      description: {
        story:
          'When some rows have actions and others do not, rows without actions get the `--no-actions` modifier so the values stay aligned.',
      },
    },
  },
};

export const MultipleActionsPerRow: Story = {
  args: {
    rows: [
      {
        key: 'Licence',
        value: 'For personal use',
        actions: [
          { href: '#', children: 'Change', visuallyHiddenText: 'licence type' },
          { href: '#', children: 'Remove', visuallyHiddenText: 'licence' },
        ],
      },
    ],
  },
};

export const Card: Story = {
  render: (args) => (
    <SummaryCard
      title="University of Gloucestershire"
      actions={[
        { href: '#', children: 'Delete choice', visuallyHiddenText: 'of' },
        { href: '#', children: 'Withdraw', visuallyHiddenText: 'from' },
      ]}
    >
      <SummaryList
        {...args}
        rows={[
          {
            key: 'Course',
            value: (
              <>
                English (3DMD)
                <br />
                PGCE with QTS full time
              </>
            ),
          },
          { key: 'Location', value: 'School name, Road, City, SW1 1AA' },
        ]}
      />
    </SummaryCard>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Summary cards group related summary lists with a title and card-level actions. The card title is appended to the visually hidden text of every action link inside the card.',
      },
    },
  },
};
