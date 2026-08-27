import { AutoSizeInput, Typography } from '@game-cms/ui';
import { type KeyboardEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './SpeedInput.module.scss';

interface SpeedInputProps {
  speed: number;
  onSpeedChanged?: (speed: number) => void;
}

const MIN_SPEED = 0.1;

export function SpeedInput({ speed, onSpeedChanged }: SpeedInputProps) {
  const { t } = useTranslation('game', {
    keyPrefix: 'micro.SpineController.SpeedInput',
  });

  const [editValue, setEditValue] = useState<string | null>(null);

  const commit = (raw: string) => {
    setEditValue(null);

    const parsed = Number.parseFloat(raw);
    if (parsed !== speed && Number.isFinite(parsed) && parsed >= MIN_SPEED) {
      onSpeedChanged?.(parsed);
    }
  };

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
        aria-label={t('speed')}
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
