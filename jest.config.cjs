module.exports = {
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },

  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],

  testMatch: ["<rootDir>/tests/**/*.test.js", "<rootDir>/tests/**/*.test.jsx"],

  moduleFileExtensions: ["js", "jsx", "cjs"],

  transformIgnorePatterns: ["/node_modules/(?!(lucide-react)/)"],

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/tests/styleMock.js",

    // Never load the real Vite/Firebase ESM module during Jest tests.
    "^.*firebase/firebase$": "<rootDir>/tests/__mocks__/firebase.cjs",
  },
};
