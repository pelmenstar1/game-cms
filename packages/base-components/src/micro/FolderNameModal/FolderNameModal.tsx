import {
  Button,
  ErrorBoard,
  Labeled,
  ModalDialog,
  type ModalProps,
  testValidationResult,
  TextInput,
  useValidation,
} from '@game-cms/ui';
import { useState } from 'react';

import styles from './FolderNameModal.module.scss';

export interface FolderNameModalProps extends ModalProps<string | undefined> {
  className?: string;
}

export function FolderNameModal({ onClose }: FolderNameModalProps) {
  const [name, setName] = useState<string>('');

  const validation = useValidation({
    empty: [name.length > 0, 'Name cannot be empty'],
    noSlashes: [!name.includes('/'), 'Name cannot have slashes (/)'],
  });

  const isValid = testValidationResult(validation);

  const createButton = (
    <Button
      disabled={!isValid}
      buttonVariant="solid"
      onClick={() => {
        onClose(name);
      }}
    >
      Create
    </Button>
  );

  return (
    <ModalDialog effect="blur" onClose={onClose} footer={createButton}>
      <Labeled title="Name">
        <TextInput value={name} onTextChanged={setName} error={!isValid} />
      </Labeled>

      <ErrorBoard className={styles['error-board']} items={validation} />
    </ModalDialog>
  );
}
