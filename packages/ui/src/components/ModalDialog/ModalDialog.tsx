import { ReactElement, ReactNode, useId } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay, ModalOverlayEffect } from '../ModalOverlay';
import { Typography } from '../Typography';
import styles from './ModalDialog.module.scss';
import { useScrollbar } from '../../hooks';
import { CloseIcon } from '../../icons';
import { classNames } from '../../utils/classNames';
import { IconButton } from '../IconButton';

type ModalDialogProps = {
  title?: string;
  contentClassName?: string;
  footer?: ReactElement;
  onClose?: () => void;
  tightLayout?: boolean;
  effect?: ModalOverlayEffect;
  children: ReactNode;
};

export function ModalDialog({
  title,
  footer,
  children,
  contentClassName,
  tightLayout,
  effect = 'tint',
  onClose,
}: ModalDialogProps) {
  const titleId = useId();

  useScrollbar(false);

  return createPortal(
    <ModalOverlay className={styles.overlay} effect={effect}>
      <div
        className={classNames(
          styles.dialog,
          tightLayout && styles['dialog-tight-layout']
        )}
        role="dialog"
        aria-labelledby={titleId}
      >
        <div className={styles.header}>
          {title === undefined ? undefined : (
            <Typography variant="h5" id={titleId}>
              {title}
            </Typography>
          )}

          <IconButton
            className={styles.close}
            onClick={onClose}
            title="Закрити діалог"
          >
            <CloseIcon />
          </IconButton>
        </div>

        <div className={classNames(styles.content, contentClassName)}>
          {children}
        </div>

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </ModalOverlay>,
    document.body
  );
}
