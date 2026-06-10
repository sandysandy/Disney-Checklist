import type { Meta, StoryObj } from '@storybook/react-vite';
import { PasswordInput } from './PasswordInput';

const meta = {
  title: 'Components/Password input',
  component: PasswordInput,
  parameters: {
    docs: {
      description: {
        component: `Use the password input component to help users accessibly enter passwords, with a button to show what they have typed and check it's correct.

**When to use:** whenever you ask users for a password. Allow them to paste, do not restrict length when signing in, and use the right \`autocomplete\` value: \`current-password\` when signing in, \`new-password\` when creating one.

[GOV.UK Design System: Password input](https://design-system.service.gov.uk/components/password-input/)`,
      },
    },
  },
  argTypes: {
    labelSize: { control: 'radio', options: [undefined, 's', 'm', 'l', 'xl'] },
  },
  args: {
    label: 'Password',
    name: 'password',
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AsPageHeading: Story = {
  args: {
    labelIsPageHeading: true,
    labelSize: 'l',
  },
};

export const NewPassword: Story = {
  args: {
    label: 'Create a password',
    hint: 'Must be at least 8 characters',
    autoComplete: 'new-password',
  },
};

export const WithError: Story = {
  args: {
    errorMessage: 'Enter a password',
  },
};

export const Translated: Story = {
  args: {
    label: 'Cyfrinair',
    showPasswordText: 'Datguddia',
    hidePasswordText: 'Cuddio',
    showPasswordAriaLabelText: 'Dangos cyfrinair',
    hidePasswordAriaLabelText: 'Cuddio cyfrinair',
    passwordShownAnnouncementText: 'Mae eich cyfrinair yn weladwy.',
    passwordHiddenAnnouncementText: 'Mae eich cyfrinair wedi’i guddio.',
  },
  parameters: {
    docs: {
      description: {
        story: 'All visible text and announcements can be translated via the i18n props.',
      },
    },
  },
};
