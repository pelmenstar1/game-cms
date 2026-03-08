import { ModalDialog, ModalProps, Tab, UncontrolledTabs } from '@game-cms/ui';

import { useHasPermission } from '../../shared.js';
import styles from './FileInfoModal.module.scss';
import { GeneralTab } from './GeneralTab/index.js';
import { PreviewTab } from './PreviewTab/index.js';
import { TraceTab } from './TraceTab/index.js';
import { FileInfo } from './types.js';

export interface FileInfoModalProps extends ModalProps {
  item: FileInfo;
}

export function FileInfoModal({ item, onClose }: FileInfoModalProps) {
  const canTraceFile = useHasPermission('storage/file$trace');

  return (
    <ModalDialog onClose={onClose} contentClassName={styles.content}>
      <UncontrolledTabs className={styles.tabs} tabClassName={styles.tab}>
        <Tab tabId="general" title="General">
          <GeneralTab item={item} />
        </Tab>

        <Tab tabId="preview" title="Preview">
          <PreviewTab item={item} />
        </Tab>

        {canTraceFile && (
          <Tab tabId="trace" title="Trace">
            <TraceTab fileId={item.id} />
          </Tab>
        )}
      </UncontrolledTabs>
    </ModalDialog>
  );
}
