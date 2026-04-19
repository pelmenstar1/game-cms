import {
  classNames,
  DownloadIcon,
  FitScreenIcon,
  IconButton,
  IconSwitchButton,
  LoopIcon,
  Slider,
  Typography,
} from '@game-cms/ui';
import { useTranslation } from 'react-i18next';

import { PlayButton } from '../../PlayButton/index.js';
import { SpeedSwitch } from '../SpeedSwitch/index.js';
import { SpeedValue } from '../types.js';
import styles from './Header.module.scss';

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
  speed: SpeedValue;

  onRunningChanged?: (value: boolean) => void;
  onLoopChanged?: (value: boolean) => void;
  onAnimationTimeChanged?: (value: number) => void;
  onSpeedChanged?: (value: SpeedValue) => void;
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

  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles['buttons']}>
        <PlayButton isRunning={isRunning} onRunningChanged={onRunningChanged} />

        <SpeedSwitch
          className={styles['speed-switch']}
          speed={speed}
          onSpeedChanged={onSpeedChanged}
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
