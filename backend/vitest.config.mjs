import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: [
      "tests/**/*.{test,spec}.js",
      "{config,db,middleware,routes,services,utils}/**/*.{test,spec}.js",
    ],
    exclude: ["node_modules/**", "data/**"],
  },
});
