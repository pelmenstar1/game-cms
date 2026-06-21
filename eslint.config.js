// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
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
      '*/**/build/',
      '*/**/vite.config.ts',
      '**/.react-router',
      '**/storybook-static',
      'node_modules',
      'packages/*/vite.storybook.config.ts',
      'packages/*/scripts/*',
      'packages/*/.storybook',
      'packages/base-plugin/test-setups',
    ],
  },
  eslint.configs.recommended,
  react.configs.flat.recommended,
  reactHooks.configs.flat['recommended-latest'],
  tseslint.configs.strictTypeChecked,
  unicorn.configs.recommended,
  importPlugin.flatConfigs.recommended,
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
      'no-console': [
        'error',
        {
          allow: ['error'],
        },
      ],

      'unicorn/prevent-abbreviations': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-negated-condition': 'off',
      'unicorn/prefer-at': 'off',
      'unicorn/no-for-loop': 'off',
      'unicorn/no-process-exit': 'off',
      'unicorn/prefer-event-target': 'off',
      'unicorn/no-magic-array-flat-depth': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/prefer-query-selector': 'off',
      'unicorn/numeric-separators-style': 'off',
      'unicorn/prefer-dom-node-remove': 'off',
      // Not supported with Eslint 9
      'unicorn/logical-assignment-operators': 'off',
      'unicorn/name-replacements': 'off',
      'unicorn/no-computed-property-existence-check': 'off',
      'unicorn/consistent-boolean-name': 'off',
      'unicorn/prefer-early-return': 'off',
      'unicorn/max-nested-calls': 'off',
      'unicorn/prefer-await': 'off',
      'unicorn/prefer-global-number-constants': 'off',
      'unicorn/no-nonstandard-builtin-properties': 'off',
      'unicorn/prefer-continue': 'off',
      'unicorn/no-break-in-nested-loop': 'off',
      'unicorn/prefer-identifier-import-export-specifiers': 'off',
      'unicorn/no-top-level-assignment-in-function': 'off',
      'unicorn/prefer-number-coercion': 'off',
      'unicorn/prefer-minimal-ternary': 'off',
      'unicorn/no-useless-recursion': 'off',

      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'always' },
      ],
      '@typescript-eslint/no-unnecessary-type-arguments': 'off',

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks: '(useAsyncCallback|useAbstractQueryResult)',
        },
      ],

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      'import/no-unresolved': 'off',
      'import/no-named-as-default': 'off',
      'import/named': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-duplicates': 'error',
      'unicorn/require-array-sort-compare': 'off',
      'unicorn/prefer-uint8array-base64': 'off',
      'unicorn/no-unsafe-property-key': 'off',
      'unicorn/no-non-function-verb-prefix': 'off',
    },
  },
  {
    // This package intentionally manages namespaced global singletons
    // (the shared CMS environment/controller) via `globalThis`.
    files: ['packages/global/src/**'],
    rules: {
      'unicorn/no-global-object-property-assignment': 'off',
    },
  },
  prettier
);
