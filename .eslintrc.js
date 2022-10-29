module.exports = {
  env: {
    browser: true
  },
  extends: [
    "google",
    "prettier",
    "plugin:react-hooks/recommended"
  ],
  parser: "babel-eslint",
  plugins: ["react-hooks", "react"],
  rules: {
    "react-hooks/rules-of-hooks": "warn", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies,
    "react/jsx-uses-react": "error",   
     "react/jsx-uses-vars": "error" 
  }
};
