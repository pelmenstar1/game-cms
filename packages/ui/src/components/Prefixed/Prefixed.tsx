import { ReactNode } from 'react';

import { Typography } from '../Typography';

export type PrefixedProps = {
  className?: string;
  value: string;
  children: ReactNode;
};

export function Prefixed({ className, value, children }: PrefixedProps) {
  return (
    <Typography className={className}>
      <Typography as="span" weight="bold">{`${value}: `}</Typography>
      {children}
    </Typography>
  );
}
