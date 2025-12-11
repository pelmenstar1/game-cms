import { createContextHook } from '../../utils/hookContext';
import { StylesheetInjectContext } from './context';
import { StylesheetInjectProvider } from './provider';

export const useStylesheetInject = createContextHook(
  StylesheetInjectContext,
  StylesheetInjectProvider
);
