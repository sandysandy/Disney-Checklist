import React, { useEffect } from 'react';
import type { Decorator, Preview } from '@storybook/react-vite';
import '../src/styles/index.scss';

/**
 * Apply the GOV.UK page template classes to the document so stories render on
 * the same canvas a real GOV.UK page would (background colour, font smoothing).
 */
function GovukTemplate({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add('govuk-template');
    document.body.classList.add('govuk-template__body');
    document.body.classList.add('js-enabled', 'govuk-frontend-supported');
  }, []);
  return <>{children}</>;
}

const withGovukTemplate: Decorator = (Story) => (
  <GovukTemplate>
    <Story />
  </GovukTemplate>
);

const preview: Preview = {
  decorators: [withGovukTemplate],
  parameters: {
    layout: 'padded',
    a11y: {
      // Fail the story (and CI test runs) on any axe violation.
      test: 'error',
    },
    options: {
      storySort: {
        order: ['Introduction', 'Tokens', 'Components', 'Patterns'],
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
