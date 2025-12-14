import { parseTimeSpec, type TimeSpec } from '@game-cms/shared/chrono';
import { useMemo, useState } from 'react';

import type { ModalProps } from '../../hooks';
import { formatTimeSpec } from '../../utils/timeFormatter';
import { Button } from '../Button';
import { ModalDialog } from '../ModalDialog';
import { TextInput } from '../TextInput';
import { Typography } from '../Typography';
import styles from './TimeSelectCustomDialog.module.scss';

export type TimeSelectCustomDialogProps = ModalProps<string | undefined>;

export function TimeSelectCustomDialog({
  onClose,
}: TimeSelectCustomDialogProps) {
  const [spec, setSpec] = useState<TimeSpec>('');
  const isValidSpec = useMemo(() => !Number.isNaN(parseTimeSpec(spec)), [spec]);

  const onSubmit = () => {
    onClose(spec);
  };

  const submitButton = (
    <Button disabled={!isValidSpec} buttonVariant="solid" onClick={onSubmit}>
      OK
    </Button>
  );

  return (
    <ModalDialog
      onClose={onClose}
      footer={submitButton}
      contentClassName={styles.content}
    >
      <TextInput error={!isValidSpec} value={spec} onTextChanged={setSpec} />

      {isValidSpec && <Typography>{formatTimeSpec(spec)}</Typography>}
    </ModalDialog>
  );
}
