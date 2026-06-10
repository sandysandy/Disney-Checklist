import type { Meta, StoryObj } from '@storybook/react-vite';
import { StartPage } from './StartPage';
import { InsetText } from '../../components/InsetText/InsetText';
import { PageTemplate } from '../PageTemplate/PageTemplate';

const meta = {
  title: 'Patterns/Start page',
  component: StartPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Tells users what the service does, whether they're eligible and what they'll need, ending in the green "Start now" button. On GOV.UK the start page lives on www.gov.uk; in a prototype this pattern stands in for it.

[GOV.UK Design System: Start using a service](https://design-system.service.gov.uk/patterns/start-using-a-service/)`,
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
} satisfies Meta<typeof StartPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Apply for a juggling licence',
    startHref: '#',
    children: (
      <>
        <p className="govuk-body">Use this service to apply for a licence to juggle in public.</p>
        <p className="govuk-body">Applying takes around 5 minutes.</p>
        <h2 className="govuk-heading-m">Before you start</h2>
        <p className="govuk-body">You will need:</p>
        <ul className="govuk-list govuk-list--bullet">
          <li>your full name</li>
          <li>details of the juggling tricks you can perform</li>
        </ul>
        <InsetText>
          You cannot apply on behalf of someone else — they must apply themselves.
        </InsetText>
      </>
    ),
    related: (
      <aside className="govuk-prototype-kit-common-templates-related-items" role="complementary">
        <h2 className="govuk-heading-m">Related content</h2>
        <ul className="govuk-list govuk-!-font-size-16">
          <li>
            <a className="govuk-link" href="#">
              Street performance rules
            </a>
          </li>
          <li>
            <a className="govuk-link" href="#">
              Busking and street entertainment
            </a>
          </li>
        </ul>
      </aside>
    ),
  },
};
