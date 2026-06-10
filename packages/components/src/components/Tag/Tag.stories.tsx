import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from './Tag';

const COLOURS = [
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
] as const;

const meta = {
  title: 'Components/Tag',
  component: Tag,
  parameters: {
    docs: {
      description: {
        component: `Use the tag component to show users the status of something, for example the status of each application in a task list page.

**When not to use:** do not use tags as a way of styling regular text or links, and avoid inventing new colour meanings — keep the number of different colours to a minimum and use them consistently.

[GOV.UK Design System: Tag](https://design-system.service.gov.uk/components/tag/)`,
      },
    },
  },
  argTypes: {
    colour: {
      control: 'select',
      options: [undefined, ...COLOURS],
      description: 'Colour variant matching the GOV.UK `govuk-tag--<colour>` modifier classes',
    },
  },
  args: {
    children: 'Completed',
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Grey: Story = {
  args: { colour: 'grey', children: 'Inactive' },
};

export const Green: Story = {
  args: { colour: 'green', children: 'New' },
};

export const Red: Story = {
  args: { colour: 'red', children: 'Urgent' },
};

export const AllColours: Story = {
  render: () => (
    <table className="govuk-table">
      <tbody className="govuk-table__body">
        {COLOURS.map((colour) => (
          <tr key={colour} className="govuk-table__row">
            <td className="govuk-table__cell">
              <Tag colour={colour}>{colour}</Tag>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Every additional colour available via the `colour` prop.',
      },
    },
  },
};
