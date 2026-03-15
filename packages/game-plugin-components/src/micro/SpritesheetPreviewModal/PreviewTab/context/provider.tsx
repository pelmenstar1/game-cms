import { PropsWithChildren, useMemo, useState } from 'react';

import { PreviewTabContext, PreviewTabContextType } from './context';

export function PreviewTabContextProvider({ children }: PropsWithChildren) {
  const [selectedFrame, setSelectedFrame] = useState<string>();

  const context = useMemo(
    (): PreviewTabContextType => ({
      selectedFrame,
      setSelectedFrame,
    }),
    [selectedFrame]
  );

  return (
    <PreviewTabContext.Provider value={context}>
      {children}
    </PreviewTabContext.Provider>
  );
}
