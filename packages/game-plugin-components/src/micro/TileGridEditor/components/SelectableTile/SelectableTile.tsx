import { classNames } from '@game-cms/ui';
import { ComponentProps } from 'react';

import styles from './SelectableTile.module.scss';

export interface SelectableTileProps extends ComponentProps<'div'> {
  selected: boolean;
  onSelectedChanged?: (state: boolean) => void;
}

export function SelectableTile({
  className,
  selected,
  onSelectedChanged,
}: SelectableTileProps) {
  return (
    <div
      className={classNames(
        styles.root,
        selected && styles['root-selected'],
        className
      )}
      onClick={() => onSelectedChanged?.(!selected)}
    />
  );
}
