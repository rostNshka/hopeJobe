import js from '@eslint/js'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: {
      js,
      react: pluginReact,
      prettier: prettierPlugin,
    },
    extends: [
      js.configs.recommended,
      pluginReact.configs.flat.recommended,
      prettierConfig,
    ],
    rules: {
      ...prettierPlugin.configs.recommended.rules,
      'no-console': 'warn',
      eqeqeq: 'warn',
      curly: 'warn',
      'no-else-return': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: pluginReact,
      prettier: prettierPlugin,
    },
    extends: [
      ...tseslint.configs.recommended,
      pluginReact.configs.flat.recommended,
      prettierConfig,
    ],
    rules: {
      ...prettierPlugin.configs.recommended.rules,
      'no-console': 'warn',
      eqeqeq: 'warn',
      curly: 'warn',
      'no-else-return': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
    languageOptions: {
      parser: tseslint.parser,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
  },
])
