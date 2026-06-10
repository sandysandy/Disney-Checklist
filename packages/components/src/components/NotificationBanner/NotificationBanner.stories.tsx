import type { Meta, StoryObj } from '@storybook/react-vite';
import { NotificationBanner } from './NotificationBanner';

const meta = {
  title: 'Components/Notification banner',
  component: NotificationBanner,
  parameters: {
    docs: {
      description: {
        component: `Use a notification banner to tell users about something they need to know about, but that's not directly related to the page content — for example to tell them something was successful, or about a problem elsewhere in the service.

**When not to use:** to give feedback on the page the user is interacting with, use an error summary or a confirmation page instead. Avoid showing more than one notification banner per page.

[GOV.UK Design System: Notification banner](https://design-system.service.gov.uk/components/notification-banner/)`,
      },
    },
  },
  argTypes: {
    type: {
      control: 'radio',
      options: [undefined, 'success'],
      description: 'The success variant is green and announced immediately via role="alert"',
    },
    titleText: { control: 'text' },
    titleHeadingLevel: { control: 'select', options: [1, 2, 3, 4, 5, 6] },
    titleId: { control: 'text' },
    disableAutoFocus: { control: 'boolean' },
  },
  args: {
    children: (
      <p className="govuk-notification-banner__heading">
        You have 7 days left to send your application.{' '}
        <a className="govuk-notification-banner__link" href="#deadline">
          View application
        </a>
        .
      </p>
    ),
  },
} satisfies Meta<typeof NotificationBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Success: Story = {
  args: {
    type: 'success',
    children: (
      <>
        <h3 className="govuk-notification-banner__heading">Training outcome recorded</h3>
        <p className="govuk-body">
          Contact{' '}
          <a className="govuk-notification-banner__link" href="mailto:example@department.gov.uk">
            example@department.gov.uk
          </a>{' '}
          if you think there&rsquo;s a problem.
        </p>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use the success variant when an action a user has taken was successful. It uses role="alert" and is focused on mount so it is announced straight away.',
      },
    },
  },
};

export const WithCustomTitle: Story = {
  args: {
    titleText: 'Action required',
  },
};

export const PlainTextContent: Story = {
  args: {
    children: 'There may be a delay in processing your application.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Plain string content is wrapped in the default single-line heading style.',
      },
    },
  },
};
