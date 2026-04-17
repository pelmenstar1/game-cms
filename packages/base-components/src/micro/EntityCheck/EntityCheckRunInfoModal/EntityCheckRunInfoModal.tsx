import { getEntityCheckRun } from '@game-cms/base-api/client';
import {
  DataLoader,
  ModalDialog,
  ModalProps,
  Tab,
  UncontrolledTabs,
} from '@game-cms/ui';

import { useApiQuery } from '../../../hooks/useApiQuery.js';
import styles from './EntityCheckRunInfoModal.module.scss';
import { InfoTab } from './InfoTab/index.js';
import { LogsTab } from './LogsTab/index.js';

export interface EntityCheckRunInfoModalProps extends ModalProps {
  runId: string;
}

export function EntityCheckRunInfoModal({
  runId,
  onClose,
}: EntityCheckRunInfoModalProps) {
  const [result] = useApiQuery(getEntityCheckRun, [runId]);

  return (
    <ModalDialog
      onClose={onClose}
      contentClassName={styles.content}
      title="Entity check run"
    >
      <DataLoader result={result}>
        {(run) => (
          <UncontrolledTabs className={styles.tabs} tabClassName={styles.tab}>
            <Tab tabId="info" title="Info">
              <InfoTab run={run} />
            </Tab>

            {run.logEntries && run.logEntries.length > 0 && (
              <Tab tabId="logs" title="Logs">
                <LogsTab logEntries={run.logEntries} />
              </Tab>
            )}
          </UncontrolledTabs>
        )}
      </DataLoader>
    </ModalDialog>
  );
}
