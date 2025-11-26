/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */


// export default {
//     preset: "ts-jest",
//     transform: {
//         '^.+\\.ts?$': 'ts-jest',
//     },
//     clearMocks: true,
//     collectCoverage: true,
//     coverageDirectory: 'coverage',
//     coverageProvider: 'v8',
//     modulePaths: ["<rootDir>/src"],
//     testMatch: ['**/tests/unit/*.spec.ts'],
// };

// jest.config.ts

// import type { Config } from "jest";

// const config: Config = {
//   preset: "ts-jest",
//   transform: {
//     "^.+\\.ts$": ["ts-jest", { diagnostics: false }],
//   },
//   clearMocks: true,
//   collectCoverage: true,
//   coverageDirectory: "coverage",
//   coverageProvider: "v8",
//   modulePaths: ["<rootDir>/src"],
//   testMatch: ["**/tests/unit/*.spec.ts"],
//   moduleFileExtensions: ["ts", "js", "json", "node"],
// };

// export default config;

module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  modulePaths: ["<rootDir>/src"],
  testMatch: ["**/tests/unit/*.spec.ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
};