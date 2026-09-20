import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/__tests__/**/*.test.{ts,tsx}"],
    exclude: [
      "**/node_modules/**",
      "**/.claude/**",
      "**/.next/**",
      "**/dist/**",
    ],
    coverage: {
      reporter: ["text", "json-summary"],
      include: [
        "lib/validations/**",
        "app/actions/**",
        "app/api/**",
        "components/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
