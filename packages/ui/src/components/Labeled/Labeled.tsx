import { ComponentProps, ReactNode } from 'react';

import { Typography, TypographyVariant } from '../Typography';
import styles from './Labeled.module.scss';

export interface LabeledProps extends ComponentProps<'div'> {
  title: string;
  titleVariant?: TypographyVariant;
  children: ReactNode;
}

export function Labeled({
  title,
  titleVariant,
  children,
  ...rest
}: LabeledProps) {
  return (
    <div {...rest}>
      <Typography className={styles.title} variant={titleVariant}>
        {title}
      </Typography>
      {children}
    </div>
  );
}
