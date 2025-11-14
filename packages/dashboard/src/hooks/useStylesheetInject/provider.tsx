import { type PropsWithChildren, useMemo, useState } from 'react';

import {
  StylesheetInjectContext,
  type StylesheetInjectContextType,
} from './context';

export function StylesheetInjectProvider({ children }: PropsWithChildren) {
  const [stylesheets, setStylesheets] = useState<string[]>([]);

  const context = useMemo(
    (): StylesheetInjectContextType => ({
      addStylesheet: (url) => {
        setStylesheets((values) =>
          values.includes(url) ? values : [...values, url]
        );
      },
    }),
    []
  );

  return (
    <StylesheetInjectContext.Provider value={context}>
      {stylesheets.map((url) => (
        <link key={url} rel="stylesheet" href={url} />
      ))}

      {children}
    </StylesheetInjectContext.Provider>
  );
}
