// @ts-check

/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-scss', 'stylelint-config-standard-scss'],
  ignoreFiles: [
    '**/node_modules',
    '**/dist/**',
    'packages/dashboard/build/**',
    'demo-app/build/**',
    'demo-platformer/cms/build/**',
    'packages/base-components/dist/**',
    'packages/ui/dist/**',
    'coverage/**',
    '**/storybook-static/**',
  ],
  rules: {
    'selector-class-pattern': null,
    'declaration-empty-line-before': null,
    'value-keyword-case': null,
    'scss/dollar-variable-pattern': null,
    'media-feature-range-notation': null,
    'color-function-notation': null,
    'color-function-alias-notation': null,
    'alpha-value-notation': null,
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global'] },
    ],
  },
};
