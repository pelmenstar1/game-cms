import { DataLoader, Typography, useTextFetch } from '@game-cms/ui';

export interface JsonProps {
  className?: string;
  url: string;
}

export function Json({ className, url }: JsonProps) {
  const result = useTextFetch(url);

  return (
    <DataLoader className={className} result={result}>
      {(text) => <Typography>{text}</Typography>}
    </DataLoader>
  );
}
