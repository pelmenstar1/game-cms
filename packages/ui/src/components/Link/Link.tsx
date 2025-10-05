import { ComponentProps } from 'react';
import { Link as RouterLink } from 'react-router';

import { Typography, TypographyProps } from '../Typography';
import styles from './Link.module.scss';
import { classNames } from '../../utils/classNames';

type AnchorProps = ComponentProps<typeof RouterLink>;

export interface LinkProps extends TypographyProps, AnchorProps {
  linkVariant?: 'clean' | 'underline';
}

export function Link({ linkVariant = 'clean', className, ...rest }: LinkProps) {
  return (
    <Typography
      as={RouterLink}
      className={classNames(
        styles.root,
        styles[`root-variant-${linkVariant}`],
        className
      )}
      {...rest}
    />
  );
}
