import { WarningIcon } from '../../icons';
import { classNames } from '../../utils/classNames';
import { Typography, type TypographyProps } from '../Typography';
import styles from './WarningBlock.module.scss';

export interface WarningBlockProps extends TypographyProps {
  className?: string;
  children: string;
}

export function WarningBlock({
  className,
  children,
  ...rest
}: WarningBlockProps) {
  return (
    <Typography className={classNames(styles.root, className)} {...rest}>
      <WarningIcon className={styles.icon} />
      {children}
    </Typography>
  );
}
