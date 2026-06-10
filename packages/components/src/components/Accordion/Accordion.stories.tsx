import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './Accordion';
import type { AccordionProps } from './Accordion';

function ControlledAccordion(args: AccordionProps) {
  const [expanded, setExpanded] = useState([true, false, false, false]);
  return (
    <Accordion
      {...args}
      expandedSections={expanded}
      onSectionToggle={(index, isExpanded) =>
        setExpanded((previous) => previous.map((value, i) => (i === index ? isExpanded : value)))
      }
    />
  );
}

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    docs: {
      description: {
        component: `Use the accordion component to let users show and hide sections of related content on a page. It is most helpful for users on mobile or to those using screen magnifiers.

**When not to use:** accordions hide content, so only use one if user research supports it. Do not use an accordion for content every user needs to see, and consider simpler alternatives first: plain headings, the details component, or splitting content across pages. Do not put an accordion inside another accordion.

By default the expanded or collapsed state of each section is remembered for the rest of the session (\`rememberExpanded\`); give the accordion a stable \`id\` so the state survives navigation.

[GOV.UK Design System: Accordion](https://design-system.service.gov.uk/components/accordion/)`,
      },
    },
  },
  argTypes: {
    headingLevel: { control: 'radio', options: [1, 2, 3, 4, 5, 6] },
    rememberExpanded: { control: 'boolean' },
    hideAllSections: { control: 'text' },
    hideSection: { control: 'text' },
    hideSectionAriaLabel: { control: 'text' },
    showAllSections: { control: 'text' },
    showSection: { control: 'text' },
    showSectionAriaLabel: { control: 'text' },
  },
  args: {
    rememberExpanded: false,
    sections: [
      {
        heading: 'Writing well for the web',
        content: <p className="govuk-body">This is the content for Writing well for the web.</p>,
      },
      {
        heading: 'Writing well for specialists',
        content: (
          <p className="govuk-body">This is the content for Writing well for specialists.</p>
        ),
      },
      {
        heading: 'Know your audience',
        content: <p className="govuk-body">This is the content for Know your audience.</p>,
      },
      {
        heading: 'How people read',
        content: <p className="govuk-body">This is the content for How people read.</p>,
      },
    ],
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAdditionalDescriptions: Story = {
  args: {
    sections: [
      {
        heading: 'Understanding agile project management',
        summary: 'Introductions, methods, core features.',
        content: (
          <ul className="govuk-list">
            <li>
              <a className="govuk-link" href="#understanding-agile">
                Agile and government services: an introduction
              </a>
            </li>
            <li>
              <a className="govuk-link" href="#agile-methods">
                Agile methods: an introduction
              </a>
            </li>
          </ul>
        ),
      },
      {
        heading: 'Working with agile methods',
        summary: 'Workspaces, tools and techniques, user stories, planning.',
        content: (
          <ul className="govuk-list">
            <li>
              <a className="govuk-link" href="#agile-tools">
                Agile tools and techniques
              </a>
            </li>
          </ul>
        ),
      },
    ],
  },
};

export const WithSectionExpanded: Story = {
  args: {
    sections: [
      {
        heading: 'Section A',
        content: <p className="govuk-body">This section starts expanded.</p>,
        expanded: true,
      },
      {
        heading: 'Section B',
        content: <p className="govuk-body">This section starts collapsed.</p>,
      },
    ],
  },
};

export const RemembersExpandedState: Story = {
  args: {
    id: 'accordion-remember',
    rememberExpanded: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'With `rememberExpanded` (the govuk-frontend default) the state of each section is saved to `sessionStorage` keyed by the section content id, so it is restored when the user returns. Requires a stable `id`.',
      },
    },
  },
};

export const Translated: Story = {
  args: {
    hideAllSections: 'Cuddio pob adran',
    hideSection: 'Cuddio',
    hideSectionAriaLabel: "Cuddio'r adran hon",
    showAllSections: 'Dangos pob adran',
    showSection: 'Dangos',
    showSectionAriaLabel: 'Dangos yr adran hon',
  },
  parameters: {
    docs: {
      description: {
        story: 'All visible and assistive text can be replaced through the i18n props.',
      },
    },
  },
};

export const Controlled: Story = {
  render: (args) => <ControlledAccordion {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'Pass `expandedSections` and `onSectionToggle` to control the expanded state from outside the component.',
      },
    },
  },
};
