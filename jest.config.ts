import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^.+\\.svg$": "jest-transformer-svg",
  },

  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.svg$": "jest-transformer-svg", // SVG 변환 추가
  },

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transformIgnorePatterns: [
    "/node_modules/(?!your-module-to-transform|another-module)",
  ],
};

export default config;
