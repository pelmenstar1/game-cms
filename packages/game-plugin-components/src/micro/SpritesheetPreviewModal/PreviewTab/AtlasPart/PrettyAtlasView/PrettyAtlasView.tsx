import { classNames, List, Prefixed, Typography } from '@game-cms/ui';

import { SpritesheetDataWithSize } from '../../../../../utils/spritesheet/types';
import { usePreviewTabContext } from '../../context';
import styles from './PrettyAtlasView.module.scss';

export interface PrettyAtlasViewProps {
  className?: string;
  spritesheet: SpritesheetDataWithSize;
}

export function PrettyAtlasView({
  className,
  spritesheet,
}: PrettyAtlasViewProps) {
  const { selectedFrame, setSelectedFrame } = usePreviewTabContext();

  return (
    <List className={classNames(styles.root, className)}>
      {Object.entries(spritesheet.frames).map(([name, { frame }]) => (
        <li
          key={name}
          className={classNames(
            styles.item,
            selectedFrame === name && styles['item-selected']
          )}
          onClick={() => {
            setSelectedFrame(name);
          }}
        >
          <Typography weight="bold">{name}</Typography>

          <div className={styles['item-bounds']}>
            <Prefixed value="X">{frame.x}</Prefixed>
            <Prefixed value="Y">{frame.y}</Prefixed>
            <Prefixed value="Width">{frame.w}</Prefixed>
            <Prefixed value="Height">{frame.h}</Prefixed>
          </div>
        </li>
      ))}
    </List>
  );
}
