import {
  CircularProgress,
  classNames,
  DarkModeIcon,
  ErrorMessage,
  IconButton,
  LightModeIcon,
} from '@game-cms/ui';
import { ComponentProps, useCallback, useState } from 'react';

import {
  BackgroundTheme,
  ModelStatus,
  ThreeDModelRenderer,
} from '../ThreeDModelRenderer';
import styles from './ThreeDModelController.module.scss';

export interface ThreeDModelControllerProps extends ComponentProps<'div'> {
  source: string;
}

export function ThreeDModelController({
  className,
  source,
  ...rest
}: ThreeDModelControllerProps) {
  const [modelStatus, setModelStatus] = useState<ModelStatus>({
    type: 'loading',
    progress: 0,
  });

  const [backgroundTheme, setBackgroundTheme] =
    useState<BackgroundTheme>('light');

  const switchBackgroundTheme = useCallback(() => {
    setBackgroundTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <div className={classNames(styles.root, className)} {...rest}>
      {modelStatus.type === 'loaded' && (
        <IconButton
          className={styles['switch-theme']}
          title="Switch theme"
          hover="fill"
          onClick={switchBackgroundTheme}
        >
          {backgroundTheme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      )}

      <ThreeDModelRenderer
        className={classNames(
          styles.renderer,
          modelStatus.type === 'loaded' && styles['renderer-loaded']
        )}
        source={source}
        backgroundTheme={backgroundTheme}
        onModelStatusChanged={setModelStatus}
      />

      {modelStatus.type === 'loading' || modelStatus.type === 'error' ? (
        <div className={styles['overlay']}>
          {modelStatus.type === 'loading' ? (
            <CircularProgress progress={modelStatus.progress} />
          ) : (
            <ErrorMessage>Failed to load the model</ErrorMessage>
          )}
        </div>
      ) : null}
    </div>
  );
}
