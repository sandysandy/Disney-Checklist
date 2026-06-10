import type { Meta, StoryObj } from '@storybook/react-vite';
import { TaskList } from './TaskList';

const meta = {
  title: 'Components/Task list',
  component: TaskList,
  parameters: {
    docs: {
      description: {
        component: `Use the task list component to give users an overview of the tasks involved in completing a service, the order to complete them in, and whether each one is complete.

**When to use:** for services with long transactions that users may not finish in one sitting, or where tasks can be completed in any order.

**When not to use:** if your service only has a few short tasks, a simple linear journey is usually better. Show a status against every task: use a blue tag for "In progress", a tag with appropriate colour for other in-progress states, plain text for "Completed", and greyed-out text for tasks that "Cannot start yet".

[GOV.UK Design System: Task list](https://design-system.service.gov.uk/components/task-list/)`,
      },
    },
  },
  argTypes: {
    idPrefix: { control: 'text' },
  },
  args: {
    items: [
      {
        title: 'Company Directors',
        href: '#',
        status: { text: 'Completed' },
      },
      {
        title: 'Registered company details',
        href: '#',
        status: { tag: { colour: 'light-blue', children: 'Not yet started' } },
      },
      {
        title: 'Business plan',
        href: '#',
        hint: 'Ensure the plan covers objectives, strategies, sales, marketing and financial forecasts.',
        status: { tag: { colour: 'blue', children: 'In progress' } },
      },
      {
        title: 'Documentation',
        href: '#',
        status: { tag: { colour: 'blue', children: 'In progress' } },
      },
      {
        title: 'Charitable status',
        href: '#',
        status: { tag: { colour: 'red', children: 'Error' } },
      },
      {
        title: 'Payment',
        hint: 'It will cost between £15 and £75',
        status: { text: 'Cannot start yet', cannotStartYet: true },
      },
    ],
  },
} satisfies Meta<typeof TaskList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHints: Story = {
  args: {
    items: [
      {
        title: 'Business plan',
        href: '#',
        hint: 'Ensure the plan covers objectives, strategies, sales, marketing and financial forecasts.',
        status: { tag: { colour: 'blue', children: 'In progress' } },
      },
      {
        title: 'Payment',
        href: '#',
        hint: 'It will cost between £15 and £75',
        status: { tag: { colour: 'light-blue', children: 'Not yet started' } },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Only add hint text if there is evidence it helps users. It is linked to the task link with `aria-describedby`.',
      },
    },
  },
};

export const AllStatuses: Story = {
  args: {
    items: [
      { title: 'Completed task', href: '#', status: { text: 'Completed' } },
      {
        title: 'Incomplete task',
        href: '#',
        status: { tag: { colour: 'blue', children: 'Incomplete' } },
      },
      {
        title: 'Not yet started task',
        href: '#',
        status: { tag: { colour: 'light-blue', children: 'Not yet started' } },
      },
      {
        title: 'Task with a problem',
        href: '#',
        status: { tag: { colour: 'red', children: 'There is a problem' } },
      },
      {
        title: 'Blocked task',
        status: { text: 'Cannot start yet', cannotStartYet: true },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Statuses can be plain text ("Completed", greyed "Cannot start yet") or tags in any GOV.UK tag colour.',
      },
    },
  },
};

export const CannotStartYet: Story = {
  args: {
    items: [
      {
        title: 'Pay the registration fee',
        hint: 'You cannot pay until your business plan has been approved',
        status: { text: 'Cannot start yet', cannotStartYet: true },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tasks that cannot be started yet have no link and a greyed-out status, so users do not mistake them for clickable tasks.',
      },
    },
  },
};
