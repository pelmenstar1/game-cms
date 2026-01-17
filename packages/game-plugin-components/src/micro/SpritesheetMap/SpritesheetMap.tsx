import { classNames } from '@game-cms/ui';

import styles from './SpritesheetMap.module.scss';
import type { SpritesheetDataWithSize } from './types';

export interface SpritesheetMapProps {
  className?: string;
  spritesheet: SpritesheetDataWithSize;
}

export function SpritesheetMap({
  className,
  spritesheet,
}: SpritesheetMapProps) {
  const { w: imageWidth, h: imageHeight } = spritesheet.meta.size;

  return (
    <div className={classNames(styles.root, className)}>
      {Object.entries(spritesheet.frames).map(([name, frame]) => {
        const { x, y, w, h } = frame.frame;

        return (
          <div
            key={name}
            className={styles.frame}
            style={{
              '--x': (x / imageWidth).toFixed(3),
              '--y': (y / imageHeight).toFixed(3),
              '--w': (w / imageWidth).toFixed(3),
              '--h': (h / imageHeight).toFixed(3),
            }}
          />
        );
      })}
    </div>
  );
}
