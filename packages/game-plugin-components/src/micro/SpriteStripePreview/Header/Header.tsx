import { classNames, Slider } from '@game-cms/ui';

import { PlayButton } from '../../PlayButton';
import styles from './Header.module.scss';

export interface HeaderProps {
  className?: string;
  frameIndex: number;
  maxFrameIndex: number;
  isRunning: boolean;

  onFrameIndexChanged: (value: number) => void;
  onRunningChanged: (value: boolean) => void;
}

export function Header({
  className,
  frameIndex,
  maxFrameIndex,
  isRunning,
  onFrameIndexChanged,
  onRunningChanged,
}: HeaderProps) {
  return (
    <div className={classNames(styles['root'], className)}>
      <Slider
        value={frameIndex}
        min={0}
        max={maxFrameIndex}
        step={1}
        onValueChanged={onFrameIndexChanged}
        className={styles['slider']}
      />

      <PlayButton isRunning={isRunning} onRunningChanged={onRunningChanged} />
    </div>
  );
}
