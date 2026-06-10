import type { StorybookConfig } from '@storybook/react-vite';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const here = path.dirname(new URL(import.meta.url).pathname);

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: (viteConfig) => {
    viteConfig.css = {
      ...viteConfig.css,
      preprocessorOptions: {
        scss: {
          // Resolve `@use "govuk-frontend/..."` from the workspace root.
          loadPaths: [path.resolve(here, '../../../node_modules')],
        },
      },
    };
    return viteConfig;
  },
  staticDirs: [
    {
      // Serve the official govuk-frontend assets (fonts, images, crests) at
      // /assets, matching govuk-frontend's default $govuk-assets-path.
      from: path.join(
        path.dirname(require.resolve('govuk-frontend/package.json')),
        'dist/govuk/assets',
      ),
      to: '/assets',
    },
  ],
};

export default config;
