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
      '*/**/dist/',
      '*/**/vite.config.ts',
      '**/.react-router',
      'node_modules',
      'eslint.config.mts',
      'vitest.config.ts',
      'demo-app/build',
      'packages/dashboard/build',
      'packages/dashboard/.storybook',
      'packages/dashboard/vite.storybook.config.ts',
      'packages/ui/.storybook',
      'packages/ui/vite.storybook.config.ts',
      'packages/base-api/scripts/*',
      'packages/base-components/scripts/copyStyles.ts',
      'coverage',
    ],
  },
  eslint.configs.recommended,
  react.configs.flat.recommended,
  reactHooks.configs.flat['recommended-latest'],
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
      'unicorn/prefer-at': 'off',
      'unicorn/no-for-loop': 'off',

      '@typescript-eslint/restrict-template-expressions': 'off',

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks: '(useAsyncCallback)',
        },
      ],

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  prettier
);
