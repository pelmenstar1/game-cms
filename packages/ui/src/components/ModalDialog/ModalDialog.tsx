import { type ReactElement, type ReactNode, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';

import { useScrollbar } from '../../hooks';
import { useHotkey } from '../../hooks/useHotkey';
import type { ModalProps } from '../../hooks/useModal/context';
import { CloseIcon } from '../../icons';
import { classNames } from '../../utils/classNames';
import { IconButton } from '../IconButton';
import { ModalOverlay, type ModalOverlayEffect } from '../ModalOverlay';
import { Typography } from '../Typography';
import styles from './ModalDialog.module.scss';

type ModalDialogVariant = 'tight' | 'wide';

interface ModalDialogProps extends ModalProps {
  title?: string;
  contentClassName?: string;
  footer?: ReactElement;
  effect?: ModalOverlayEffect;
  variant?: ModalDialogVariant;
  fastExit?: boolean;
  children: ReactNode;
}

export function ModalDialog({
  title,
  footer,
  children,
  contentClassName,
  variant,
  effect = 'tint',
  fastExit = false,
  onClose,
}: ModalDialogProps) {
  const titleId = useId();

  useScrollbar(false);

  const onFastExit = useCallback(() => {
    if (fastExit) {
      onClose(undefined);
    }
  }, [fastExit, onClose]);

  useHotkey(['Escape'], onFastExit);

  return createPortal(
    <ModalOverlay className={styles.overlay} effect={effect}>
      <div
        className={classNames(
          styles.dialog,
          styles[`dialog-variant-${variant}`]
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
            onClick={() => {
              onClose(undefined);
            }}
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
