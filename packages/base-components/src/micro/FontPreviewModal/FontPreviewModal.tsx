import {
  DataLoader,
  FontDescriptor,
  ModalDialog,
  ModalProps,
  TextInput,
  Typography,
  useTemporaryFonts,
} from '@game-cms/ui';
import { useState } from 'react';

import styles from './FontPreviewModal.module.scss';

export interface FontPreviewModalProps extends ModalProps {
  fonts: FontDescriptor[];
}

export function FontPreviewModal({ onClose, fonts }: FontPreviewModalProps) {
  const [text, setText] = useState(
    'The quick brown fox jumps over the lazy dog'
  );

  const fontIdsResult = useTemporaryFonts(fonts);

  return (
    <ModalDialog title="Font preview" onClose={onClose}>
      <TextInput
        className={styles['input']}
        value={text}
        onTextChanged={setText}
      />

      <DataLoader result={fontIdsResult} className={styles['list']}>
        {(fontIds) =>
          fonts.map((font, i) => (
            <div key={font.source} className={styles['item']}>
              <Typography
                variant="caption"
                className={styles['item-description']}
              >
                {font.style} / {font.weight}
              </Typography>

              <p
                style={{ '--font-family': fontIds[i] }}
                className={styles['item-text']}
              >
                {text}
              </p>
            </div>
          ))
        }
      </DataLoader>
    </ModalDialog>
  );
}
