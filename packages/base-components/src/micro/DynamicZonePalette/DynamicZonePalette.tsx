import { Button, classNames } from '@game-cms/ui';

import styles from './DynamicZonePalette.module.scss';

type DynamicZonePaletteItem<K> = {
  key: K;
  title: string;
};

export interface DynamicZonePaletteProps<K> {
  className?: string;
  items: DynamicZonePaletteItem<K>[];
  error?: boolean;

  onItemClick: (key: K) => void;
}

export function DynamicZonePalette<K>({
  className,
  items,
  error,
  onItemClick,
}: DynamicZonePaletteProps<K>) {
  return (
    <div
      className={classNames(
        styles.root,
        error && styles['root-error'],
        className
      )}
    >
      {items.map(({ key, title }) => {
        const onClick = () => {
          onItemClick(key);
        };

        return (
          <Button key={key} className={styles.item} onClick={onClick}>
            {title}
          </Button>
        );
      })}
    </div>
  );
}
