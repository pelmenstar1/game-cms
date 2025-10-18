import { type ReactNode, useMemo, useState } from 'react';

import {
  StylesheetInjectContext,
  type StylesheetInjectContextType,
} from './context';

type StylesheetInjectProps = {
  children: ReactNode;
};

export function StylesheetInject(props: StylesheetInjectProps) {
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

      {props.children}
    </StylesheetInjectContext.Provider>
  );
}
