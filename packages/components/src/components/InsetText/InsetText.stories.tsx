import type { Meta, StoryObj } from '@storybook/react-vite';
import { InsetText } from './InsetText';

const meta = {
  title: 'Components/Inset text',
  component: InsetText,
  parameters: {
    docs: {
      description: {
        component: `Use the inset text component to differentiate a block of text from the content that surrounds it, for example quotes, examples or additional information about the page.

**When not to use:** some users do not notice inset text if it's used on complex pages or near to other prominent elements, so use it sparingly. Do not use inset text for warnings — use the warning text component instead.

[GOV.UK Design System: Inset text](https://design-system.service.gov.uk/components/inset-text/)`,
      },
    },
  },
  args: {
    children:
      'It can take up to 8 weeks to register a lasting power of attorney if there are no mistakes in the application.',
  },
} satisfies Meta<typeof InsetText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
