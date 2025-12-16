import { Button, ModalDialog, type ModalProps, Typography } from '@game-cms/ui';

export interface ConfirmationDialogProps extends ModalProps<
  boolean | undefined
> {
  prompt: string;
}

export function ConfirmationDialog({
  prompt,
  onClose,
}: ConfirmationDialogProps) {
  const disagree = () => {
    onClose(false);
  };

  const agree = () => {
    onClose(true);
  };

  return (
    <ModalDialog
      effect="blur"
      onClose={onClose}
      footer={
        <>
          <Button buttonVariant="solid" onClick={disagree}>
            No
          </Button>
          <Button onClick={agree}>Yes</Button>
        </>
      }
    >
      <Typography>{prompt}</Typography>
    </ModalDialog>
  );
}
