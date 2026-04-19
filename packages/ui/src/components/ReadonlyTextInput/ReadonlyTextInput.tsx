import { copyToClipboard } from '@game-cms/shared/browser';
import type { ComponentProps } from 'react';

import { CopyIcon } from '../../icons';
import { classNames } from '../../utils/classNames';
import { IconButton } from '../IconButton';
import { useNotification } from '../Notification';
import { Typography } from '../Typography';
import styles from './ReadonlyTextInput.module.scss';

export interface ReadonlyTextInputProps extends ComponentProps<'div'> {
  text: string;
}

export function ReadonlyTextInput({
  className,
  text,
  ...rest
}: ReadonlyTextInputProps) {
  const notification = useNotification();
  const onCopy = () => {
    copyToClipboard(text)
      .then(() => {
        notification.info('Text copied');
      })
      .catch(() => {
        notification.error('Failed to copy text');
      });
  };

  return (
    <div className={classNames(styles.root, className)} {...rest}>
      <Typography as="input" className={styles.input} value={text} readOnly />

      <IconButton
        className={styles.copy}
        title="Copy"
        onClick={onCopy}
        hover="fill"
      >
        <CopyIcon />
      </IconButton>
    </div>
  );
}
