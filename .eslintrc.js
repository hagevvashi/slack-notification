module.exports = {
  root: true,
  env: {
    browser: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  extends: [
    "airbnb-base",
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
  ],
  plugins: ["prettier", "@typescript-eslint"],
  settings: {
    "import/resolver": {
      typescript: {
        directory: "./tsconfig.json",
      },
    },
  },
  rules: {
    "import/prefer-default-export": 0,
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
      },
    ],
  },
};
