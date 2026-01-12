import { DataLoader, Typography, useTextFetch } from '@game-cms/ui';

import styles from './Text.module.scss';

export interface TextProps {
  className?: string;
  url: string;
}

export function Text({ className, url }: TextProps) {
  const result = useTextFetch(url);

  return (
    <DataLoader className={className} result={result}>
      {(text) => <Typography className={styles.text}>{text}</Typography>}
    </DataLoader>
  );
}
