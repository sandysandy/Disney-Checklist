import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConfirmationPage } from './ConfirmationPage';
import { PageTemplate } from '../PageTemplate/PageTemplate';

const meta = {
  title: 'Patterns/Confirmation page',
  component: ConfirmationPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Confirms the user has completed the transaction: a green panel with the reference number, then what happens next. Only show it at the very end of a journey.

[GOV.UK Design System: Confirmation pages](https://design-system.service.gov.uk/patterns/confirmation-pages/)`,
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
} satisfies Meta<typeof ConfirmationPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Application complete',
    reference: 'HDJ2123F',
    children: (
      <>
        <p className="govuk-body">We have sent you a confirmation email.</p>
        <h2 className="govuk-heading-m">What happens next</h2>
        <p className="govuk-body">
          We’ve sent your application to your local juggling licence office.
        </p>
        <p className="govuk-body">
          They will contact you either to confirm your licence, or to ask for more information.
        </p>
        <p className="govuk-body">
          <a className="govuk-link" href="#">
            What did you think of this service?
          </a>{' '}
          (takes 30 seconds)
        </p>
      </>
    ),
  },
};
