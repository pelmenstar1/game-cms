import { createContext } from 'react';

export interface PreviewTabContextType {
  selectedFrame?: string;
  setSelectedFrame: (value: string) => void;
}

export const PreviewTabContext = createContext<PreviewTabContextType>({
  setSelectedFrame: () => {},
});
