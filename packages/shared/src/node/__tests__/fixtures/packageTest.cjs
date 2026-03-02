/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { resolveImport } = require('../../package.js');

resolveImport({ resolve: undefined, url: __filename }, './target.js');
