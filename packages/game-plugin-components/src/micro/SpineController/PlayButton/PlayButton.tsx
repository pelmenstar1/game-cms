import {
  classNames,
  IconButton,
  type IconButtonProps,
  PauseIcon,
  PlayIcon,
} from '@game-cms/ui';

import styles from './PlayButton.module.scss';

export type PlayButtonProps = Omit<IconButtonProps, 'title' | 'children'> & {
  isRunning: boolean;

  onRunningChanged?: (value: boolean) => void;
};

export function PlayButton({
  className,
  isRunning,
  onRunningChanged,
  ...rest
}: PlayButtonProps) {
  const onClick = () => {
    onRunningChanged?.(!isRunning);
  };

  return (
    <IconButton
      className={classNames(styles.root, className)}
      title={isRunning ? 'Pause' : 'Play'}
      onClick={onClick}
      {...rest}
    >
      {isRunning ? <PauseIcon /> : <PlayIcon />}
    </IconButton>
  );
}
