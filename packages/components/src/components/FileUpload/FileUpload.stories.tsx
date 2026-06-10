import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileUpload } from './FileUpload';

const meta = {
  title: 'Components/File upload',
  component: FileUpload,
  parameters: {
    docs: {
      description: {
        component: `Use the file upload component to help users select and upload a file.

**When not to use:** only ask users to upload something if it's critical to the delivery of your service. Tell users what file formats and sizes you accept, and consider letting them take a photo with their device instead.

[GOV.UK Design System: File upload](https://design-system.service.gov.uk/components/file-upload/)`,
      },
    },
  },
  argTypes: {
    labelSize: { control: 'radio', options: [undefined, 's', 'm', 'l', 'xl'] },
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Upload a file',
    name: 'file-upload',
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: {
    label: 'Upload your photo',
    hint: 'Your photo may be in your Pictures, Photos, Downloads or Desktop folder. Or in an app like iPhoto.',
  },
};

export const Multiple: Story = {
  args: {
    label: 'Upload your evidence',
    hint: 'You can upload more than one file',
    multiple: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Upload a file',
    errorMessage: 'The CSV must be smaller than 2MB',
  },
};
