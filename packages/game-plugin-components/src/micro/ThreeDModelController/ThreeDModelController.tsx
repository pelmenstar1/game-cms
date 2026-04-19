import { cycleArray } from '@game-cms/shared/collections';
import { CircularProgress, classNames, ErrorMessage } from '@game-cms/ui';
import { ComponentProps, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  BackgroundTheme,
  LIGHTING_TYPES,
  LightingType,
  ModelStatus,
  ThreeDModelRenderer,
} from '../ThreeDModelRenderer';
import { Header } from './Header';
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

  const [lightingType, setLightingType] = useState<LightingType>('directional');

  const switchBackgroundTheme = useCallback(() => {
    setBackgroundTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const cycleLightingType = useCallback(() => {
    setLightingType((prev) => cycleArray(LIGHTING_TYPES, prev));
  }, []);

  const { t } = useTranslation('game', {
    keyPrefix: 'micro.ThreeDModelController',
  });

  return (
    <div className={classNames(styles.root, className)} {...rest}>
      {modelStatus.type === 'loaded' && (
        <Header
          className={styles.toolbar}
          backgroundTheme={backgroundTheme}
          lightingType={lightingType}
          onSwitchTheme={switchBackgroundTheme}
          onCycleLightingType={cycleLightingType}
        />
      )}

      <ThreeDModelRenderer
        className={classNames(
          styles.renderer,
          modelStatus.type === 'loaded' && styles['renderer-loaded']
        )}
        source={source}
        backgroundTheme={backgroundTheme}
        lightingType={lightingType}
        onModelStatusChanged={setModelStatus}
      />

      {modelStatus.type === 'loading' || modelStatus.type === 'error' ? (
        <div className={styles['overlay']}>
          {modelStatus.type === 'loading' ? (
            <CircularProgress progress={modelStatus.progress} />
          ) : (
            <ErrorMessage>{t('failedToLoadModel')}</ErrorMessage>
          )}
        </div>
      ) : null}
    </div>
  );
}
