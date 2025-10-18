import { contextUseFactory } from '@game-cms/ui';
import { createContext } from 'react';

export type StylesheetInjectContextType = {
  addStylesheet: (url: string) => void;
};

export const StylesheetInjectContext =
  createContext<StylesheetInjectContextType | null>(null);

export const useStylesheetInject = contextUseFactory(
  StylesheetInjectContext,
  'StylesheetInjectContext'
);
