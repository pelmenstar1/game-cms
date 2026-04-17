import { Button, namedLazy, useModal } from '@game-cms/ui';

export interface EntityCheckFailedAddonProps {
  className?: string;
  failedRunIds: string[];
}

const EntityCheckFailedRunsModal = namedLazy(
  () => import('../EntityCheckFailedRunsModal/index.js'),
  'EntityCheckFailedRunsModal'
);

export function EntityCheckFailedAddon({
  className,
  failedRunIds,
}: EntityCheckFailedAddonProps) {
  const showModal = useModal();

  const onClick = () => {
    void showModal(EntityCheckFailedRunsModal, {
      failedRunIds,
    });
  };

  return (
    <Button className={className} buttonVariant="outlined" onClick={onClick}>
      Inspect logs
    </Button>
  );
}
