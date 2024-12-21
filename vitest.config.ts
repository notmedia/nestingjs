import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    reporters: ['default'],
    globals: true,
    coverage: {
      provider: "v8",
      include: ['packages/**/src/*'],
      exclude: ['packages/eslint-config', 'packages/**/*.spec.ts'],
      reporter: ['text', 'json', 'html'],
    },
    passWithNoTests: true,
  },
});
