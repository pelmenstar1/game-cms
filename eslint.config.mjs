// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unicorn from 'eslint-plugin-unicorn';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: [
      '**/*/worker-configuration.d.ts',
      '*/**/dist/',
      '*/**/vite.config.ts',
      '*/**/.wrangler',
      '*/**/build',
      '**/.react-router',
      'node_modules',
      'eslint.config.mts',
      'vitest.config.ts',
      'packages/ui/.storybook',
      'packages/ui/vite.storybook.config.ts',
      'packages/base-api/scripts/*',
      'coverage',
    ],
  },
  eslint.configs.recommended,
  react.configs.flat.recommended,
  reactHooks.configs['recommended-latest'],
  tseslint.configs.strictTypeChecked,
  unicorn.configs.recommended,
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      react,
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-negated-condition': 'off',

      '@typescript-eslint/restrict-template-expressions': 'off',

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  prettier
);
