import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    globalSetup: ['./tests/global-setup.ts'],
    // Los tests de integración comparten una sola base: en paralelo se
    // pisarían las reservas entre archivos.
    fileParallelism: false,
    env: {
      NODE_ENV: 'test',
    },
  },
});
