module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    testMatch: [
        "**/__tests__/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)",
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    coverageDirectory: "coverage",
    collectCoverageFrom: [
        "src/**/*.{js,ts}",
        "!src/**/*.d.ts",
        "!src/**/*.test.{js,ts}",
        "!src/**/*.spec.{js,ts}",
    ],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};