import { JsonText, Tab, UncontrolledTabs } from '@game-cms/ui';

import { AtlasData } from '../types';
import styles from './AtlasPart.module.scss';
import { PrettyAtlasView } from './PrettyAtlasView';

export interface AtlasPartProps {
  className?: string;
  atlasData?: AtlasData;
  imageUrl: string;
}

export function AtlasPart({ className, atlasData, imageUrl }: AtlasPartProps) {
  if (!atlasData) {
    return null;
  }

  return (
    <UncontrolledTabs className={className} tabClassName={styles.tab}>
      <Tab tabId="pretty" title="Pretty">
        <PrettyAtlasView spritesheet={atlasData.value} imageUrl={imageUrl} />
      </Tab>

      <Tab tabId="raw" title="Raw">
        <JsonText text={atlasData.raw} />
      </Tab>
    </UncontrolledTabs>
  );
}
