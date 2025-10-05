import { MouseEvent, useLayoutEffect, useRef } from 'react';

import { Typography } from '../Typography';
import styles from './SelectItems.module.scss';

export interface SelectItemsProps<K extends string> {
  items: { key: K; title: string }[];
  selectedKey?: K;
  scrollY: number;
  onRetainScrollY: (value: number) => void;
  onItemClick: (event: MouseEvent) => void;
}

export function SelectItems<K extends string>({
  items,
  scrollY,
  selectedKey,
  onItemClick,
  onRetainScrollY,
}: SelectItemsProps<K>) {
  const rootRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (root) {
      if (scrollY > 0) {
        root.scrollTo(0, scrollY);
      }

      return () => {
        onRetainScrollY(root.scrollTop);
      };
    }

    // Setup scroll position only on initial render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ul className={styles.root} ref={rootRef}>
      {items.map(({ key, title }) => (
        <Typography
          as="li"
          className={selectedKey === key ? styles['item-selected'] : undefined}
          key={key}
          data-key={key}
          onMouseDown={onItemClick}
        >
          {title}
        </Typography>
      ))}
    </ul>
  );
}
