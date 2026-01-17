import { type ComponentProps, useEffect, useState } from 'react';

export interface DownloadLinkProps extends Omit<ComponentProps<'a'>, 'href'> {
  data: Blob;
}

export function DownloadLink({ data, download, ...rest }: DownloadLinkProps) {
  const [href, setHref] = useState<string>();

  useEffect(() => {
    const url = URL.createObjectURL(data);
    setHref(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [data]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return <a href={href} {...rest} download={download ?? true} />;
}
