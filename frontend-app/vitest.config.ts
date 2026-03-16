import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["zone.js", "zone.js/testing", "src/test-setup.ts"],
    include: ["src/**/*.spec.ts"],
  },
});
