import { classNames, Select } from '@game-cms/ui';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('game', {
    keyPrefix: 'micro.SpineController.SkinSelector',
  });

  const items = useMemo(
    () => skins.map((name) => ({ key: name, title: name })),
    [skins]
  );

  return (
    <Select
      className={classNames(styles.root, className)}
      items={items}
      selectedItem={selectedSkin}
      placeholder={t('skin')}
      onItemSelected={onSkinSelected}
    />
  );
}
