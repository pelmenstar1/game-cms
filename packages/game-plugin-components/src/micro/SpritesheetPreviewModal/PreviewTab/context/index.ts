import { useContext } from 'react';

import { PreviewTabContext } from './context';

export * from './context';
export * from './provider';

export function usePreviewTabContext() {
  return useContext(PreviewTabContext);
}
