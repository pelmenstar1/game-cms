import { createContext } from 'react';

export type StylesheetInjectContextType = {
  addStylesheet: (url: string) => void;
  addStylesheets: (urls: string[]) => void;
};

export const StylesheetInjectContext =
  createContext<StylesheetInjectContextType | null>(null);
