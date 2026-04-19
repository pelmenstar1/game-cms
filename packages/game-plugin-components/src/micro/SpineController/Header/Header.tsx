import {
  classNames,
  DownloadIcon,
  FitScreenIcon,
  IconButton,
  IconSwitchButton,
  LoopIcon,
  OptionSwitch,
  Slider,
  Typography,
} from '@game-cms/ui';
import { useTranslation } from 'react-i18next';

import { PlayButton } from '../../PlayButton/index.js';
import styles from './Header.module.scss';
import { SpeedInput } from './SpeedInput.js';

const PRESET_SPEEDS = [0.5, 1, 2];
const CUSTOM_SPEED = -1;
const PRESET_SPEEDS_SET = new Set(PRESET_SPEEDS);
const SPEED_OPTIONS = [...PRESET_SPEEDS, CUSTOM_SPEED];

function formatSeconds(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds - m * 60;

  return `${m}:${s.toFixed(2).padStart(5, '0')}`;
}

export interface HeaderProps {
  className?: string;
  isRunning: boolean;
  loop: boolean;
  animationTime: number;
  animationDuration: number;
  speed: number;

  onRunningChanged?: (value: boolean) => void;
  onLoopChanged?: (value: boolean) => void;
  onAnimationTimeChanged?: (value: number) => void;
  onSpeedChanged?: (value: number) => void;
  onExportFrame?: () => void;
  onFit?: () => void;
}

export function Header({
  className,
  isRunning,
  loop,
  animationTime,
  animationDuration,
  speed,
  onRunningChanged,
  onLoopChanged,
  onAnimationTimeChanged,
  onSpeedChanged,
  onExportFrame,
  onFit,
}: HeaderProps) {
  const { t } = useTranslation('game', {
    keyPrefix: 'micro.SpineController.Header',
  });

  const currentSeconds = animationTime * animationDuration;
  const isCustomSpeed = !PRESET_SPEEDS_SET.has(speed);

  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles['buttons']}>
        <PlayButton isRunning={isRunning} onRunningChanged={onRunningChanged} />

        <OptionSwitch
          className={styles['speed-switch']}
          itemClassName={styles['speed-switch-item']}
          options={SPEED_OPTIONS}
          selected={isCustomSpeed ? CUSTOM_SPEED : speed}
          onOptionSelected={(value) => {
            if (value !== CUSTOM_SPEED) {
              onSpeedChanged?.(value);
            }
          }}
          renderOption={(option) =>
            option === CUSTOM_SPEED ? (
              <SpeedInput speed={speed} onSpeedChanged={onSpeedChanged} />
            ) : (
              <Typography weight="bold">{option}x</Typography>
            )
          }
        />

        <Typography className={styles['time']} weight="bold">
          {formatSeconds(currentSeconds)} / {formatSeconds(animationDuration)}
        </Typography>

        <IconSwitchButton
          className={classNames(styles['icon-button'], styles['loop'])}
          title={t('loop')}
          checked={loop}
          onCheckedChanged={onLoopChanged}
        >
          <LoopIcon />
        </IconSwitchButton>

        <IconButton
          className={styles['icon-button']}
          title={t('fit')}
          onClick={onFit}
        >
          <FitScreenIcon />
        </IconButton>

        <IconButton
          className={styles['icon-button']}
          title={t('exportFrame')}
          onClick={onExportFrame}
        >
          <DownloadIcon />
        </IconButton>
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
