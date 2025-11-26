module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    '^@handler/(.*)$': '<rootDir>/src/handler/$1',  // Adjust the path based on your structure
  },
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  modulePaths: ["<rootDir>/src"],
  testMatch: ["**/tests/unit/*.spec.ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
};