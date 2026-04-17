import { listEntityCheckRuns } from '@game-cms/base-api/client';
import { DataLoader, ModalDialog, ModalProps } from '@game-cms/ui';
import { useMemo } from 'react';

import { useApiQuery } from '../../../hooks/useApiQuery.js';
import { EntityCheckRunList } from '../EntityCheckRunList/EntityCheckRunList.js';

export interface EntityCheckFailedRunsModalProps extends ModalProps {
  failedRunIds: string[];
}

export function EntityCheckFailedRunsModal({
  onClose,
  failedRunIds,
}: EntityCheckFailedRunsModalProps) {
  const options = useMemo(
    () => ({
      runId: failedRunIds,
      size: failedRunIds.length,
    }),
    [failedRunIds]
  );

  const [result] = useApiQuery(listEntityCheckRuns, [options]);

  return (
    <ModalDialog title="Failed entity check runs" onClose={onClose}>
      <DataLoader result={result}>
        {({ items }) => (
          <EntityCheckRunList
            items={items}
            fields={['checkId', 'createdAt', 'finishedAt']}
          />
        )}
      </DataLoader>
    </ModalDialog>
  );
}
