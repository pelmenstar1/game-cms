import {
  classNames,
  SearchIcon,
  TextInput,
  UnstyledOption,
} from '@game-cms/ui';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './AnimationList.module.scss';
import { filterAnimations } from './utils.js';

export interface AnimationListProps {
  className?: string;
  animations: string[];
  selectedAnimation: string | undefined;

  onAnimationSelected?: (value: string) => void;
}

export function AnimationList({
  className,
  animations,
  selectedAnimation,
  onAnimationSelected,
}: AnimationListProps) {
  const [query, setQuery] = useState('');

  const filteredAnimations = useMemo(
    () => filterAnimations(animations, query),
    [animations, query]
  );

  const { t } = useTranslation('game', {
    keyPrefix: 'micro.SpineController.AnimationList',
  });

  return (
    <div className={classNames(styles['root'], className)}>
      <TextInput
        className={styles['search']}
        value={query}
        placeholder={t('search')}
        variant="underline"
        endContent={<SearchIcon />}
        onTextChanged={setQuery}
      />

      <div className={styles['list']}>
        {filteredAnimations.map((name) => {
          const checked = selectedAnimation === name;

          const onChange = () => {
            onAnimationSelected?.(name);
          };

          return (
            <UnstyledOption
              className={classNames(
                styles['list-item'],
                checked && styles['list-item-checked']
              )}
              key={name}
              type="radio"
              weight="bold"
              checked={checked}
              onChange={onChange}
            >
              {name}
            </UnstyledOption>
          );
        })}
      </div>
    </div>
  );
}
