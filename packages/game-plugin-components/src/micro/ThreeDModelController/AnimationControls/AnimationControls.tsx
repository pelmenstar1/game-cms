import {
  classNames,
  IconButton,
  PauseIcon,
  PlayIcon,
  Select,
  Slider,
} from '@game-cms/ui';
import { useTranslation } from 'react-i18next';

import { AnimationInfo } from '../../ThreeDModelRenderer';
import styles from './AnimationControls.module.scss';

export interface AnimationControlsProps {
  className?: string;
  animations: AnimationInfo[];
  activeClipIndex: number;
  isPlaying: boolean;
  currentTime: number;

  onClipSelected: (index: number) => void;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
}

function formatTime(seconds: number): string {
  return `${seconds.toFixed(2)}s`;
}

export function AnimationControls({
  className,
  animations,
  activeClipIndex,
  isPlaying,
  currentTime,
  onClipSelected,
  onPlayPause,
  onSeek,
}: AnimationControlsProps) {
  const { t } = useTranslation('game', {
    keyPrefix: 'micro.ThreeDModelController',
  });

  const clipItems = animations.map((anim, i) => ({
    key: String(i),
    title: anim.name || t('animationIndex', { index: i + 1 }),
  }));

  const activeClip = animations.at(activeClipIndex);
  const duration = activeClip?.duration ?? 0;

  return (
    <div className={classNames(styles.root, className)}>
      <Select
        className={styles['clip-select']}
        items={clipItems}
        selectedItem={String(activeClipIndex)}
        placeholder={t('selectAnimation')}
        onItemSelected={(key) => {
          onClipSelected(Number(key));
        }}
      />

      <IconButton
        className={styles['play-button']}
        title={t(isPlaying ? 'pause' : 'play')}
        onClick={onPlayPause}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </IconButton>

      <Slider
        className={styles.slider}
        min={0}
        max={duration}
        value={currentTime}
        step={0.01}
        onValueChanged={onSeek}
      />

      <span className={styles.time}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
}
