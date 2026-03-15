import { JsonText, Tab, UncontrolledTabs } from '@game-cms/ui';

import { AtlasData } from '../types';
import styles from './AtlasPart.module.scss';
import { PrettyAtlasView } from './PrettyAtlasView';

export interface AtlasPartProps {
  className?: string;
  atlasData?: AtlasData;
}

export function AtlasPart({ className, atlasData }: AtlasPartProps) {
  if (!atlasData) {
    return null;
  }

  return (
    <UncontrolledTabs className={className} tabClassName={styles.tab}>
      <Tab tabId="pretty" title="Pretty">
        <PrettyAtlasView spritesheet={atlasData.value} />
      </Tab>

      <Tab tabId="raw" title="Raw">
        <JsonText text={atlasData.raw} />
      </Tab>
    </UncontrolledTabs>
  );
}
