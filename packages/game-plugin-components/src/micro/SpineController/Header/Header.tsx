import {
  classNames,
  DownloadIcon,
  FitScreenIcon,
  IconButton,
  OptionSwitch,
  Slider,
  Typography,
} from '@game-cms/ui';
import { useTranslation } from 'react-i18next';

import { PlayButton } from '../../PlayButton/index.js';
import styles from './Header.module.scss';

const SPEED_OPTIONS = [0.5, 1, 2];

function formatSeconds(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds - m * 60;

  return `${m}:${s.toFixed(2).padStart(5, '0')}`;
}

export interface HeaderProps {
  className?: string;
  isRunning: boolean;
  animationTime: number;
  animationDuration: number;
  speed: number;

  onRunningChanged?: (value: boolean) => void;
  onAnimationTimeChanged?: (value: number) => void;
  onSpeedChanged?: (value: number) => void;
  onExportFrame?: () => void;
  onFit?: () => void;
}

export function Header({
  className,
  isRunning,
  animationTime,
  animationDuration,
  speed,
  onRunningChanged,
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

        <Typography className={styles['time']} weight="bold">
          {formatSeconds(currentSeconds)} / {formatSeconds(animationDuration)}
        </Typography>

        <IconButton className={styles['fit']} title={t('fit')} onClick={onFit}>
          <FitScreenIcon />
        </IconButton>

        <IconButton title={t('exportFrame')} onClick={onExportFrame}>
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
