import { classNames, Select } from '@game-cms/ui';
import { useMemo } from 'react';

import styles from './SkinSelector.module.scss';

export interface SkinSelectorProps {
  className?: string;
  skins: string[];
  selectedSkin?: string;
  onSkinSelected?: (skin: string) => void;
}

export function SkinSelector({
  className,
  skins,
  selectedSkin,
  onSkinSelected,
}: SkinSelectorProps) {
  const items = useMemo(
    () => skins.map((name) => ({ key: name, title: name })),
    [skins]
  );

  return (
    <Select
      className={classNames(styles.root, className)}
      items={items}
      selectedItem={selectedSkin}
      placeholder="Skin"
      onItemSelected={onSkinSelected}
    />
  );
}
