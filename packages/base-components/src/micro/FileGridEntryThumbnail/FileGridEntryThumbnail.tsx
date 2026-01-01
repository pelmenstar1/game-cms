import { FolderIcon, UnknownDocumentIcon } from '@game-cms/ui';

export interface FileGridEntryThumbnailProps {
  className?: string;
  source: { type: 'folder' } | { type: 'file'; thumbnail?: string };
}

export function FileGridEntryThumbnail({
  className,
  source,
}: FileGridEntryThumbnailProps) {
  return source.type === 'folder' ? (
    <FolderIcon className={className} />
  ) : source.thumbnail ? (
    <img src={source.thumbnail} className={className} />
  ) : (
    <UnknownDocumentIcon className={className} />
  );
}
