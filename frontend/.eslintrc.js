module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: "./",
    sourceType: "module"
  },
  plugins: ["@typescript-eslint"],
  extends: ["next", "next/core-web-vitals"],
  rules: {
    "@typescript-eslint/no-unsafe-assignment": "error"
  }
};