import { classNames } from '../../../utils/classNames';
import { OptionSwitch } from '../../OptionSwitch';
import { Slider } from '../../Slider';
import { Typography } from '../../Typography';
import { PlayButton } from '../PlayButton';
import styles from './Header.module.scss';

const SPEED_OPTIONS = [0.5, 1, 2];

export interface HeaderProps {
  className?: string;
  isRunning: boolean;
  animationTime: number;
  speed: number;

  onRunningChanged?: (value: boolean) => void;
  onAnimationTimeChanged?: (value: number) => void;
  onSpeedChanged?: (value: number) => void;
}

export function Header({
  className,
  isRunning,
  animationTime,
  speed,
  onRunningChanged,
  onAnimationTimeChanged,
  onSpeedChanged,
}: HeaderProps) {
  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles['buttons']}>
        <PlayButton isRunning={isRunning} onRunningChanged={onRunningChanged} />

        <OptionSwitch
          className={styles['speed-switch']}
          itemClassName={styles['speed-switch-item']}
          options={SPEED_OPTIONS}
          selected={speed}
          onOptionSelected={onSpeedChanged}
          renderOption={(option) => (
            <Typography weight="bold">{option}x</Typography>
          )}
        />
      </div>

      <Slider
        className={styles['time-slider']}
        min={0}
        max={1}
        value={animationTime}
        onValueChanged={onAnimationTimeChanged}
      />
    </div>
  );
}
