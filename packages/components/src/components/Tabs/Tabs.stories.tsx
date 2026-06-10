import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './Tabs';

function CasesTable({ caption, rows }: { caption: string; rows: Array<[string, number, number]> }) {
  return (
    <>
      <h2 className="govuk-heading-l">{caption}</h2>
      <table className="govuk-table">
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th scope="col" className="govuk-table__header">
              Case manager
            </th>
            <th scope="col" className="govuk-table__header">
              Cases opened
            </th>
            <th scope="col" className="govuk-table__header">
              Cases closed
            </th>
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          {rows.map(([name, opened, closed]) => (
            <tr key={name} className="govuk-table__row">
              <td className="govuk-table__cell">{name}</td>
              <td className="govuk-table__cell">{opened}</td>
              <td className="govuk-table__cell">{closed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: `The tabs component lets users navigate between related sections of content, displaying one section at a time.

**When to use:** for content users do not need to read in order and will not need to compare side by side — for example regular snapshots of the same kind of data.

**When not to use:** tabs hide content and can be hard to use; consider showing content on one page, headings, a table of contents, accordions or separate pages first. On small screens the component degrades to a list of in-page links above the sections.

[GOV.UK Design System: Tabs](https://design-system.service.gov.uk/components/tabs/)`,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Title above the tab list, shown to users of small screens',
    },
  },
  args: {
    items: [
      {
        id: 'past-day',
        label: 'Past day',
        panel: (
          <CasesTable
            caption="Past day"
            rows={[
              ['David Francis', 3, 0],
              ['Paul Farmer', 1, 0],
              ['Rita Patel', 2, 0],
            ]}
          />
        ),
      },
      {
        id: 'past-week',
        label: 'Past week',
        panel: (
          <CasesTable
            caption="Past week"
            rows={[
              ['David Francis', 24, 18],
              ['Paul Farmer', 16, 20],
              ['Rita Patel', 24, 27],
            ]}
          />
        ),
      },
      {
        id: 'past-month',
        label: 'Past month',
        panel: (
          <CasesTable
            caption="Past month"
            rows={[
              ['David Francis', 98, 95],
              ['Paul Farmer', 122, 131],
              ['Rita Patel', 126, 142],
            ]}
          />
        ),
      },
      {
        id: 'past-year',
        label: 'Past year',
        panel: (
          <CasesTable
            caption="Past year"
            rows={[
              ['David Francis', 1380, 1472],
              ['Paul Farmer', 1129, 1083],
              ['Rita Patel', 1539, 1265],
            ]}
          />
        ),
      },
    ],
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomTitle: Story = {
  args: {
    title: 'Case volumes',
  },
  parameters: {
    docs: {
      description: {
        story: 'The title is only visible below tablet width, where it labels the list of links.',
      },
    },
  },
};

export const TwoTabs: Story = {
  args: {
    items: [
      {
        id: 'open-cases',
        label: 'Open cases',
        panel: <p className="govuk-body">There are 24 open cases.</p>,
      },
      {
        id: 'closed-cases',
        label: 'Closed cases',
        panel: <p className="govuk-body">There are 18 closed cases.</p>,
      },
    ],
  },
};
