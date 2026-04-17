import { Button, classNames } from '@game-cms/ui';

import styles from './ActionBlock.module.scss';

export interface ActionBlockProps {
  className?: string;
  disabled?: boolean;
  publishDisabled?: boolean;
  saveDisabled?: boolean;
  onSave?: () => void;
  onPublish?: () => void;
  onUnpublish?: () => void;
}

export function ActionBlock({
  className,
  disabled,
  publishDisabled,
  saveDisabled,
  onSave,
  onPublish,
  onUnpublish,
}: ActionBlockProps) {
  return (
    <div className={classNames(styles['root'], className)}>
      {onPublish && (
        <Button
          buttonVariant="solid"
          onClick={onPublish}
          disabled={disabled || publishDisabled}
        >
          Publish
        </Button>
      )}

      {onSave && (
        <Button
          buttonVariant="outlined"
          onClick={onSave}
          disabled={disabled || saveDisabled}
        >
          Save
        </Button>
      )}

      {onUnpublish && (
        <Button
          buttonVariant="outlined"
          onClick={onUnpublish}
          disabled={disabled}
        >
          Unpublish
        </Button>
      )}
    </div>
  );
}
