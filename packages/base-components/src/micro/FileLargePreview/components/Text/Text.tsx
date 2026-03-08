import { DataLoader, LineCountingText, useTextFetch } from '@game-cms/ui';

import styles from './Text.module.scss';

export interface TextProps {
  className?: string;
  url: string;
}

export function Text({ className, url }: TextProps) {
  const result = useTextFetch(url);

  return (
    <DataLoader className={className} result={result}>
      {(text) => <LineCountingText className={styles.text} text={text} />}
    </DataLoader>
  );
}
