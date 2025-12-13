import { Button, ModalDialog, type ModalProps, Typography } from '@game-cms/ui';

export interface FileDeleteWarningDialogProps extends ModalProps<
  boolean | undefined
> {
  className?: string;
}

export function FileDeleteWarningDialog({
  onClose,
}: FileDeleteWarningDialogProps) {
  return (
    <ModalDialog
      effect="blur"
      onClose={onClose}
      footer={
        <>
          <Button
            buttonVariant="solid"
            onClick={() => {
              onClose(false);
            }}
          >
            No
          </Button>
          <Button
            onClick={() => {
              onClose(true);
            }}
          >
            Yes
          </Button>
        </>
      }
    >
      <Typography>
        Do you want to delete this file? This action is irreversible
      </Typography>
    </ModalDialog>
  );
}
