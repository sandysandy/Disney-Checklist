import type { Meta, StoryObj } from '@storybook/react-vite';
import { Footer } from './Footer';

const meta = {
  title: 'Components/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Use the footer at the bottom of every page of your service. It provides copyright, licensing and other information about your service and department, and can include links to other parts of your service or to support content.

By default it shows the Open Government Licence (OGL) attribution and the Crown copyright statement — only change these if your content is covered by a different licence or copyright.

[GOV.UK Design System: Footer](https://design-system.service.gov.uk/components/footer/)`,
      },
    },
  },
  argTypes: {
    metaVisuallyHiddenTitle: { control: 'text' },
    copyright: { control: 'text' },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithMetaLinks: Story = {
  args: {
    metaItems: [
      { children: 'Help', href: '#' },
      { children: 'Cookies', href: '#' },
      { children: 'Contact', href: '#' },
      { children: 'Terms and conditions', href: '#' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Use meta links for support links like Help, Cookies and Contact.',
      },
    },
  },
};

export const WithCustomMetaContent: Story = {
  args: {
    metaItems: [
      { children: 'Help', href: '#' },
      { children: 'Cookies', href: '#' },
    ],
    metaContent: (
      <>
        Built by the{' '}
        <a className="govuk-footer__link" href="#">
          Government Digital Service
        </a>
      </>
    ),
  },
};

export const WithNavigation: Story = {
  args: {
    navigation: [
      {
        title: 'Services and information',
        width: 'two-thirds',
        columns: 2,
        items: [
          { children: 'Benefits', href: '#' },
          { children: 'Births, deaths, marriages and care', href: '#' },
          { children: 'Business and self-employed', href: '#' },
          { children: 'Childcare and parenting', href: '#' },
          { children: 'Citizenship and living in the UK', href: '#' },
          { children: 'Crime, justice and the law', href: '#' },
        ],
      },
      {
        title: 'Departments and policy',
        width: 'one-third',
        items: [
          { children: 'How government works', href: '#' },
          { children: 'Departments', href: '#' },
          { children: 'Worldwide', href: '#' },
          { children: 'Policies', href: '#' },
        ],
      },
    ],
    metaItems: [
      { children: 'Help', href: '#' },
      { children: 'Cookies', href: '#' },
      { children: 'Contact', href: '#' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Use navigation sections (in columns) for links to other parts of GOV.UK.',
      },
    },
  },
};

export const CustomLicenceAndCopyright: Story = {
  args: {
    contentLicence: (
      <>
        Mae'r holl gynnwys ar gael o dan{' '}
        <a
          className="govuk-footer__link"
          href="https://www.nationalarchives.gov.uk/doc/open-government-licence-cymraeg/version/3/"
          rel="license"
        >
          Drwydded y Llywodraeth Agored v3.0
        </a>
        , ac eithrio lle nodir yn wahanol
      </>
    ),
    copyright: <>© Hawlfraint y Goron</>,
  },
  parameters: {
    docs: {
      description: {
        story: 'Override the content licence and copyright, for example for Welsh content.',
      },
    },
  },
};

export const WithoutContentLicence: Story = {
  args: {
    contentLicence: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pass `contentLicence={null}` if your content is not covered by the OGL.',
      },
    },
  },
};
