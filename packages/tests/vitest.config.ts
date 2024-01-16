/// <reference types="vitest" />

import { createRequire } from 'module';
import { defineConfig } from 'vite';

const require = createRequire(import.meta.url);

const server = require.resolve('../server/src/index.ts');
const cli = require.resolve('../cli/src/index.ts');
const runner = require.resolve('../runner/src/index.ts');
const sdk = require.resolve('../mini-loader/src/index.ts');

export default defineConfig({
  test: {
    alias: {
      '@morten-olsen/mini-loader-server': server,
      '@morten-olsen/mini-loader-cli': cli,
      '@morten-olsen/mini-loader-runner': runner,
      '@morten-olsen/mini-loader': sdk,
    },
  },
});
