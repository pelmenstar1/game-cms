import { cycleArray } from '@game-cms/shared/collections';
import { CircularProgress, classNames, ErrorMessage } from '@game-cms/ui';
import { ComponentProps, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  AnimationInfo,
  BackgroundTheme,
  LIGHTING_TYPES,
  LightingType,
  ModelStatus,
  ThreeDModelRenderer,
  ThreeDModelRendererHandle,
} from '../ThreeDModelRenderer';
import { AnimationControls } from './AnimationControls';
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
  const [isAutoRotating, setIsAutoRotating] = useState(false);

  const rendererRef = useRef<ThreeDModelRendererHandle>(null);

  const [animations, setAnimations] = useState<AnimationInfo[]>([]);
  const [activeClipIndex, setActiveClipIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekTarget, setSeekTarget] = useState<{ value: number } | undefined>();

  const switchBackgroundTheme = useCallback(() => {
    setBackgroundTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const cycleLightingType = useCallback(() => {
    setLightingType((prev) => cycleArray(LIGHTING_TYPES, prev));
  }, []);

  const toggleAutoRotate = useCallback(() => {
    setIsAutoRotating((prev) => !prev);
  }, []);

  const handleScreenshot = useCallback(() => {
    rendererRef.current?.takeScreenshot();
  }, []);

  const handleAnimationsLoaded = useCallback((loaded: AnimationInfo[]) => {
    setAnimations(loaded);
    setActiveClipIndex(0);
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const handleAnimationTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleClipSelected = useCallback((index: number) => {
    setActiveClipIndex(index);
    setCurrentTime(0);
  }, []);

  const handleSeek = useCallback((time: number) => {
    setCurrentTime(time);
    setIsPlaying(false);
    setSeekTarget({ value: time });
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
          isAutoRotating={isAutoRotating}
          onSwitchTheme={switchBackgroundTheme}
          onCycleLightingType={cycleLightingType}
          onToggleAutoRotate={toggleAutoRotate}
          onScreenshot={handleScreenshot}
        />
      )}

      <ThreeDModelRenderer
        ref={rendererRef}
        className={classNames(
          styles.renderer,
          modelStatus.type === 'loaded' && styles['renderer-loaded']
        )}
        source={source}
        backgroundTheme={backgroundTheme}
        lightingType={lightingType}
        autoRotate={isAutoRotating}
        activeClipIndex={activeClipIndex}
        isPlaying={isPlaying}
        seekTarget={seekTarget}
        onModelStatusChanged={setModelStatus}
        onAnimationsLoaded={handleAnimationsLoaded}
        onAnimationTimeUpdate={handleAnimationTimeUpdate}
      />

      {modelStatus.type === 'loaded' && animations.length > 0 && (
        <AnimationControls
          className={styles['animation-controls']}
          animations={animations}
          activeClipIndex={activeClipIndex}
          isPlaying={isPlaying}
          currentTime={currentTime}
          onClipSelected={handleClipSelected}
          onPlayPause={handlePlayPause}
          onSeek={handleSeek}
        />
      )}

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
