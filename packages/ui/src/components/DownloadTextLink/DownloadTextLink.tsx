import { useMemo } from 'react';

import { DownloadLink, type DownloadLinkProps } from '../DownloadLink';

export interface DownloadTextLinkProps extends Omit<DownloadLinkProps, 'data'> {
  className?: string;
  content: string;
  mime: string;
}

export function DownloadTextLink({
  content,
  mime,
  ...rest
}: DownloadTextLinkProps) {
  const dataBlob = useMemo(
    () =>
      new Blob([content], {
        type: mime,
      }),
    [content, mime]
  );

  return <DownloadLink data={dataBlob} {...rest} />;
}
