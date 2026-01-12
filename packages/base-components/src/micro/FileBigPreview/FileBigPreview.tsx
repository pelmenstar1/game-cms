import { FilePreview } from '../FilePreview/FilePreview.js';
import { Json } from './components/Json/Json.js';
import { Text } from './components/Text/Text.js';

export interface FileBigPreviewProps {
  className?: string;
  mime: string;
  url: string;
}

export function FileBigPreview({ className, mime, url }: FileBigPreviewProps) {
  if (mime === 'application/json') {
    return <Json className={className} url={url} />;
  }

  if (mime === 'text/plain') {
    return <Text className={className} url={url} />;
  }

  return <FilePreview className={className} mime={mime} url={url} />;
}
