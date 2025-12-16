import {
  Button,
  ModalDialog,
  type ModalProps,
  ReadonlyTextInput,
  Typography,
} from '@game-cms/ui';

export interface DisplayApiTokenDialogProps extends ModalProps {
  token: string;
}

export function DisplayApiTokenDialog({
  token,
  onClose,
}: DisplayApiTokenDialogProps) {
  const okButton = (
    <Button
      onClick={() => {
        onClose(undefined);
      }}
    >
      OK
    </Button>
  );

  return (
    <ModalDialog onClose={onClose} footer={okButton}>
      <ReadonlyTextInput text={token} />
      <Typography variant="bodyLarge">
        Save this token. You won&apos;t be able to see again
      </Typography>
    </ModalDialog>
  );
}
