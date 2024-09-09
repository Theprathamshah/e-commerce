export default {
  parser: '@typescript-eslint/parser',
  extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
  },
  rules: {
      'indent': ['error', 4],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'no-trailing-spaces': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      'space-before-function-paren': ['error', 'never'],
  },
  ignorePatterns: ['dist/**'],
};
