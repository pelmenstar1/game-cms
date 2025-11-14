import { ReactNode } from 'react';

import { classNames } from '../../utils/classNames';
import { Button } from '../Button';
import { Typography } from '../Typography';
import styles from './ErrorMessage.module.scss';

export type ErrorMessageProps = {
  onRetry?: () => void;
  className?: string;
  children: ReactNode;
};

export function ErrorMessage({
  className,
  onRetry,
  children,
}: ErrorMessageProps) {
  return (
    <div className={classNames(styles.root, className)}>
      <Typography>{children}</Typography>

      {onRetry && (
        <Button
          className={styles.retry}
          buttonVariant="outlined"
          onClick={onRetry}
        >
          Retry
        </Button>
      )}
    </div>
  );
}
