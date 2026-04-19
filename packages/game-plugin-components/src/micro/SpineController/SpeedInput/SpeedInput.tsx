import { AutoSizeInput, Typography } from '@game-cms/ui';
import { type KeyboardEvent, useState } from 'react';

import styles from './SpeedInput.module.scss';

interface SpeedInputProps {
  speed: number;
  onSpeedChanged?: (speed: number) => void;
}

const MIN_SPEED = 0.1;

export function SpeedInput({ speed, onSpeedChanged }: SpeedInputProps) {
  const [editValue, setEditValue] = useState<string | null>(null);

  const commit = (raw: string) => {
    setEditValue(null);

    const parsed = Number.parseFloat(raw);
    if (Number.isFinite(parsed) && parsed >= MIN_SPEED && parsed !== speed) {
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
    <Typography className={styles.root} weight="bold" as="div">
      <AutoSizeInput
        inputClassName={styles.input}
        type="number"
        min={MIN_SPEED}
        step="any"
        aria-label="Speed"
        value={editValue ?? speed}
        onFocus={() => {
          setEditValue(String(speed));
        }}
        onBlur={(e) => {
          commit(e.target.value);
        }}
        onTextChanged={setEditValue}
        onKeyDown={onKeyDown}
      />
      x
    </Typography>
  );
}
