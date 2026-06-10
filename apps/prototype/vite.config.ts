import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { createRequire } from 'node:module';
import { cpSync, existsSync } from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const govukAssets = path.join(
  path.dirname(require.resolve('govuk-frontend/package.json')),
  'dist/govuk/assets',
);

/**
 * Serve govuk-frontend's official assets (fonts, images, crests) at /assets —
 * matching govuk-frontend's default $govuk-assets-path — in dev, and copy them
 * into the build output.
 */
function govukAssetsPlugin(): Plugin {
  return {
    name: 'govuk-assets',
    configureServer(server) {
      server.middlewares.use('/assets', (req, res, next) => {
        const file = path.join(govukAssets, req.url?.split('?')[0] ?? '');
        if (existsSync(file)) {
          import('node:fs').then((fs) => {
            const types: Record<string, string> = {
              '.svg': 'image/svg+xml',
              '.png': 'image/png',
              '.ico': 'image/x-icon',
              '.woff': 'font/woff',
              '.woff2': 'font/woff2',
              '.json': 'application/json',
            };
            res.setHeader('Content-Type', types[path.extname(file)] ?? 'application/octet-stream');
            fs.createReadStream(file).pipe(res);
          });
        } else {
          next();
        }
      });
    },
    closeBundle() {
      cpSync(govukAssets, path.resolve(__dirname, 'dist/assets'), { recursive: true });
    },
  };
}

export default defineConfig({
  plugins: [react(), govukAssetsPlugin()],
  resolve: {
    alias: [
      // Consume the component library source directly (see ADR 002), so
      // library edits show up in the prototype without a build step.
      {
        find: /^@govuk-mui\/react$/,
        replacement: path.resolve(__dirname, '../../packages/components/src/index.ts'),
      },
    ],
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Resolve `@use "govuk-frontend/..."` from the workspace root.
        loadPaths: [path.resolve(__dirname, '../../node_modules')],
      },
    },
  },
});
