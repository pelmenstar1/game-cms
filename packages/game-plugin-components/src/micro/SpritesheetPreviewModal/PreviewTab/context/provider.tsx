import { PropsWithChildren, useMemo, useState } from 'react';

import { PreviewTabContext, PreviewTabContextType } from './context';

export function PreviewTabContextProvider({ children }: PropsWithChildren) {
  const [selectedFrame, setSelectedFrame] = useState<string>();
  const [pinnedFrame, setPinnedFrame] = useState<string>();

  const context = useMemo(
    (): PreviewTabContextType => ({
      selectedFrame,
      setSelectedFrame,
      pinnedFrame,
      setPinnedFrame,
    }),
    [selectedFrame, pinnedFrame]
  );

  return (
    <PreviewTabContext.Provider value={context}>
      {children}
    </PreviewTabContext.Provider>
  );
}
