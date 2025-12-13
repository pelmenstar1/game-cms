import { createContextHook } from '@game-cms/ui';

import { StylesheetInjectContext } from './context';
import { StylesheetInjectProvider } from './provider';

export const useStylesheetInject = createContextHook(
  StylesheetInjectContext,
  StylesheetInjectProvider
);
