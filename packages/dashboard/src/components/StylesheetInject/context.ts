import { createContext } from 'react';
import { contextUseFactory } from '@game-cms/ui';

export type StylesheetInjectContextType = {
  addStylesheet: (url: string) => void;
};

export const StylesheetInjectContext =
  createContext<StylesheetInjectContextType | null>(null);

export const useStylesheetInject = contextUseFactory(
  StylesheetInjectContext,
  'StylesheetInjectContext'
);
