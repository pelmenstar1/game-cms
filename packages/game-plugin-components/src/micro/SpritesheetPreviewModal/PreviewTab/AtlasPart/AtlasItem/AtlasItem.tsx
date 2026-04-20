import { classNames, Prefixed, Typography } from '@game-cms/ui';

import styles from './AtlasItem.module.scss';

const THUMB_SIZE = 40;

export interface AtlasItemProps {
  name: string;
  frame: { x: number; y: number; w: number; h: number };
  sheetSize: { w: number; h: number };
  imageUrl: string;
  selected: boolean;
  onClick: () => void;
}

export function AtlasItem({
  name,
  frame,
  sheetSize,
  imageUrl,
  selected,
  onClick,
}: AtlasItemProps) {
  const scale = Math.min(THUMB_SIZE / frame.w, THUMB_SIZE / frame.h);

  return (
    <li
      className={classNames(styles.root, selected && styles['root-selected'])}
      onClick={onClick}
    >
      <div className={styles.thumb} style={{ '--size': THUMB_SIZE }}>
        <img
          src={imageUrl}
          alt=""
          style={{
            width: sheetSize.w * scale,
            height: sheetSize.h * scale,
            transform: `translate(${-frame.x * scale}px, ${-frame.y * scale}px)`,
          }}
        />
      </div>

      <Typography weight="bold">{name}</Typography>

      <div className={styles.bounds}>
        <Prefixed value="X">{frame.x}</Prefixed>
        <Prefixed value="Y">{frame.y}</Prefixed>
        <Prefixed value="Width">{frame.w}</Prefixed>
        <Prefixed value="Height">{frame.h}</Prefixed>
      </div>
    </li>
  );
}
