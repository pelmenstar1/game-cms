import {
  ModalDialog,
  type ModalProps,
  Tab,
  Tabs,
  TransformView,
} from '@game-cms/ui';
import { useState } from 'react';

import type { SpritesheetUrlEntry } from '../../components/SpritesheetWrapper/types';
import { AtlasPreview } from './AtlasPreview';
import { ImagePreview } from './ImagePreview';
import styles from './SpritesheetPreviewModal.module.scss';

export interface SpritesheetPreviewModalProps extends ModalProps {
  entryMap: Record<string, SpritesheetUrlEntry>;
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
          <Tab key={key} tabId={key} title={key} className={styles['tab']}>
            <TransformView className={styles['image']}>
              <ImagePreview atlasUrl={atlasUrl} imageUrl={imageUrl} />
            </TransformView>

            <AtlasPreview url={atlasUrl} className={styles['atlas']} />
          </Tab>
        ))}
      </Tabs>
    </ModalDialog>
  );
}
