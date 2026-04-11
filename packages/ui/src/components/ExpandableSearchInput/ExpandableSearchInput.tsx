import { useState } from 'react';

import { useHotkey } from '../../hooks';
import { SearchIcon } from '../../icons';
import { classNames } from '../../utils/classNames';
import { IconButton } from '../IconButton';
import { TextInput } from '../TextInput';
import styles from './ExpandableSearchInput.module.scss';

export interface ExpandableSearchInputProps {
  className?: string;
  text: string;
  onTextChanged?: (value: string) => void;
  hotKey?: boolean;
}

export function ExpandableSearchInput({
  className,
  text,
  onTextChanged,
  hotKey,
}: ExpandableSearchInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const onIconClick = () => {
    setIsExpanded(true);
  };

  const onBlur = () => {
    if (!text) {
      setIsExpanded(false);
    }
  };

  useHotkey({
    combination: ['Control', 'f'],
    callback: onIconClick,
    isEnabled: hotKey,
  });

  return (
    <div className={classNames(styles.root, className)}>
      <IconButton
        className={styles.icon}
        title="Open search"
        hover="fill"
        onClick={onIconClick}
      >
        <SearchIcon />
      </IconButton>

      {isExpanded && (
        <TextInput
          className={styles.input}
          variant="underline"
          value={text}
          onTextChanged={onTextChanged}
          onBlur={onBlur}
          autoFocus
        />
      )}
    </div>
  );
}
