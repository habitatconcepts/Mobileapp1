// Flat config for ESLint v9. Replaces the legacy .eslintrc.js (which ESLint 9
// no longer loads). Covers JS + TypeScript + React Native sources and tests.
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const reactPlugin = require('eslint-plugin-react');
const reactNativePlugin = require('eslint-plugin-react-native');
const globals = require('globals');

module.exports = tseslint.config(
  {
    ignores: ['node_modules/**', 'dist/**', 'web-build/**', 'assets/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-native': reactNativePlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // React 19 / new JSX transform: React import not required in scope.
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // Keep parity with the old .eslintrc.js: warn, not error.
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    // Build/tooling config files run in Node CJS; require() is the idiom there.
    files: ['eslint.config.js', 'babel.config.js'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  }
);
