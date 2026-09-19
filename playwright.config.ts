import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60000,
  retries: 1,
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3111",
    screenshot: "only-on-failure",
  },
  reporter: [["list"]],
});
