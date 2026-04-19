import { OptionSwitch, Typography } from '@game-cms/ui';
import { useState } from 'react';

import { SpeedInput } from '../SpeedInput/index.js';
import { SpeedValue } from '../types.js';
import styles from './SpeedSwitch.module.scss';

const PRESET_SPEEDS = [0.5, 1, 2];
const CUSTOM_SPEED_PLACEHOLDER = -1;
const SPEED_OPTIONS = [...PRESET_SPEEDS, CUSTOM_SPEED_PLACEHOLDER];

export interface SpeedSwitchProps {
  className?: string;
  speed: SpeedValue;
  onSpeedChanged?: (value: SpeedValue) => void;
}

export function SpeedSwitch({
  className,
  speed,
  onSpeedChanged,
}: SpeedSwitchProps) {
  const [customSpeed, setCustomSpeed] = useState(() =>
    speed.isCustom ? speed.value : 1
  );

  const customOnSpeedChanged = (value: number) => {
    setCustomSpeed(value);

    // Only commit custom speed if it's currently selected to avoid
    // accidentally switching to custom mode
    // when user just wants to change preset speed
    if (speed.isCustom) {
      onSpeedChanged?.({ isCustom: true, value });
    }
  };

  return (
    <OptionSwitch
      className={className}
      itemClassName={styles['item']}
      options={SPEED_OPTIONS}
      selected={speed.isCustom ? CUSTOM_SPEED_PLACEHOLDER : speed.value}
      onOptionSelected={(value) => {
        const result =
          value === CUSTOM_SPEED_PLACEHOLDER
            ? { isCustom: true, value: customSpeed }
            : { isCustom: false, value };

        onSpeedChanged?.(result);
      }}
      renderOption={(option) =>
        option === CUSTOM_SPEED_PLACEHOLDER ? (
          <SpeedInput
            speed={customSpeed}
            onSpeedChanged={customOnSpeedChanged}
          />
        ) : (
          <Typography weight="bold">{option}x</Typography>
        )
      }
    />
  );
}
