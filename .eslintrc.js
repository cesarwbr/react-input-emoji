module.exports = {
  env: {
    browser: true
  },
  extends: [
    "plugin:react/recommended",
    "google",
    "prettier",
    "plugin:react-hooks/recommended"
  ],
  parser: "babel-eslint",
  plugins: ["react", "react-hooks"],
  rules: {
    "react-hooks/rules-of-hooks": "warn", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn" // Checks effect dependencies
  }
};
