import { DataLoader, JsonText, useTextFetch } from '@game-cms/ui';

export interface AtlasPreviewProps {
  className?: string;
  url: string;
}

export function AtlasPreview({ className, url }: AtlasPreviewProps) {
  const result = useTextFetch(url);

  return (
    <DataLoader className={className} result={result}>
      {(text) => <JsonText text={text} />}
    </DataLoader>
  );
}
