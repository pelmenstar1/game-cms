import { Typography } from '@game-cms/ui';
import { type KeyboardEvent, useState } from 'react';

import styles from './SpeedInput.module.scss';

interface SpeedInputProps {
  speed: number;
  onSpeedChanged?: (speed: number) => void;
}

export function SpeedInput({ speed, onSpeedChanged }: SpeedInputProps) {
  const [editValue, setEditValue] = useState<string | null>(null);

  const commit = (raw: string) => {
    setEditValue(null);

    const parsed = Number.parseFloat(raw);
    if (parsed > 0) {
      onSpeedChanged?.(parsed);
    }
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <>
      <input
        className={styles.input}
        type="number"
        min={0.1}
        step="any"
        aria-label="Speed"
        value={editValue ?? speed}
        onFocus={() => {
          setEditValue(String(speed));
        }}
        onChange={(e) => {
          setEditValue(e.target.value);
        }}
        onBlur={(e) => {
          commit(e.target.value);
        }}
        onKeyDown={onKeyDown}
      />
      <Typography weight="bold">x</Typography>
    </>
  );
}
