import { ModalDialog, type ModalProps, Tab, Tabs } from '@game-cms/ui';
import { useState } from 'react';

import { PreviewTab } from './PreviewTab';
import styles from './SpritesheetPreviewModal.module.scss';

export type SpritesheetPreviewModalEntry = {
  imageUrl: string;
  atlasUrl: string;
};

export type SpritesheetPreviewModalEntryMap = Record<
  string,
  SpritesheetPreviewModalEntry
>;

export interface SpritesheetPreviewModalProps extends ModalProps {
  entryMap: SpritesheetPreviewModalEntryMap;
}

export function SpritesheetPreviewModal({
  onClose,
  entryMap,
}: SpritesheetPreviewModalProps) {
  const entries = Object.entries(entryMap);
  const [tab, setTab] = useState(entries[0][0]);

  return (
    <ModalDialog onClose={onClose} contentClassName={styles['content']}>
      <Tabs
        selectedTab={tab}
        onSelectedTabChanged={setTab}
        className={styles['tabs']}
      >
        {entries.map(([key, { imageUrl, atlasUrl }]) => (
          <Tab key={key} tabId={key} title={key} className={styles.tab}>
            <PreviewTab imageUrl={imageUrl} atlasUrl={atlasUrl} />
          </Tab>
        ))}
      </Tabs>
    </ModalDialog>
  );
}
