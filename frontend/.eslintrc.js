module.exports = {
  extends: ["next", "next/core-web-vitals"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.eslint.json"],
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint"],
  // 임시로 규칙을 끄고 진행합니다
  rules: {
    "@typescript-eslint/no-unsafe-assignment": "off"
  }
};