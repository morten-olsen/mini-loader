/// <reference types="vitest" />

import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json-summary', 'json', 'html'],
      reportOnFailure: true,
      include: ['packages/*/src/**/*.ts'],
      exclude: ['packages/examples/**/*', 'packages/tests/**/*'],
    },
  },
});
