import {
  classNames,
  IndeterminateCircularProgress,
  namedLazy,
} from '@game-cms/ui';
import FileSaver from 'file-saver';
import {
  type ComponentProps,
  Suspense,
  useCallback,
  useRef,
  useState,
} from 'react';

import type { SpineRendererRefType } from '../SpineRenderer/index.js';
import type { SpineData } from '../SpineRenderer/types.js';
import { AnimationList } from './AnimationList/index.js';
import { Header } from './Header/index.js';
import { SkinSelector } from './SkinSelector/index.js';
import styles from './SpineController.module.scss';
import { SpeedValue } from './types.js';

const SpineRenderer = namedLazy(
  () => import('../SpineRenderer/index.js'),
  'SpineRenderer'
);

export interface SpineControllerProps extends ComponentProps<'div'> {
  spine: SpineData;
}

export function SpineController({
  className,
  spine,
  ...rest
}: SpineControllerProps) {
  const rendererRef = useRef<SpineRendererRefType>(null);

  const [isRunning, setRunning] = useState(true);
  const [selectedAnimation, setSelectedAnimation] = useState<string>();
  const [animations, setAnimations] = useState<string[] | undefined>();
  const [skins, setSkins] = useState<string[]>([]);
  const [selectedSkin, setSelectedSkin] = useState<string>();
  const [loop, setLoop] = useState(true);
  const [animationTime, setAnimationTime] = useState(0);
  const [animationDuration, setAnimationDuration] = useState(0);
  const [speed, setSpeed] = useState<SpeedValue>({ isCustom: false, value: 1 });

  const onAnimationsLoaded = useCallback((names: string[]) => {
    setAnimations(names);
    setSelectedAnimation(names[0]);
  }, []);

  const onSkinsLoaded = useCallback((names: string[]) => {
    setSkins(names);
    setSelectedSkin(names[0]);
  }, []);

  const onSkinSelected = useCallback((name: string) => {
    setSelectedSkin(name);
  }, []);

  const onSliderTimeChanged = useCallback((time: number) => {
    setAnimationTime(time);

    rendererRef.current?.setTime(time);
  }, []);

  const onAnimationTimeChanged = useCallback(
    (time: number, duration: number) => {
      setAnimationTime(time);
      setAnimationDuration(duration);
    },
    []
  );

  const onAnimationSelected = useCallback(
    (name: string) => {
      setSelectedAnimation(name);
      onSliderTimeChanged(0);
    },
    [onSliderTimeChanged]
  );

  const onExportFrame = useCallback(() => {
    const worker = async () => {
      const blob = await rendererRef.current?.exportFrame();
      if (!blob) {
        return;
      }

      FileSaver(blob, `${selectedAnimation ?? 'frame'}.png`);
    };

    void worker();
  }, [selectedAnimation]);

  const onFit = useCallback(() => {
    rendererRef.current?.fit();
  }, []);

  return (
    <div className={classNames(styles.root, className)} {...rest}>
      <Header
        className={styles.header}
        isRunning={isRunning}
        loop={loop}
        animationTime={animationTime}
        animationDuration={animationDuration}
        speed={speed}
        onRunningChanged={setRunning}
        onLoopChanged={setLoop}
        onAnimationTimeChanged={onSliderTimeChanged}
        onSpeedChanged={setSpeed}
        onExportFrame={onExportFrame}
        onFit={onFit}
      />

      <div className={styles['side-panel']}>
        {skins.length > 1 && (
          <SkinSelector
            skins={skins}
            selectedSkin={selectedSkin}
            onSkinSelected={onSkinSelected}
          />
        )}

        <AnimationList
          className={styles['animation-list']}
          animations={animations ?? []}
          selectedAnimation={selectedAnimation}
          onAnimationSelected={onAnimationSelected}
        />
      </div>

      <Suspense fallback={null}>
        <SpineRenderer
          ref={rendererRef}
          className={styles['renderer']}
          spine={spine}
          animation={selectedAnimation}
          skin={selectedSkin}
          loop={loop}
          isRunning={isRunning}
          speed={speed.value}
          onAnimationsLoaded={onAnimationsLoaded}
          onSkinsLoaded={onSkinsLoaded}
          onAnimationTimeChanged={onAnimationTimeChanged}
        />
      </Suspense>

      {!animations && (
        <div className={styles['loading-container']}>
          <IndeterminateCircularProgress
            className={styles['loading-progress']}
          />
        </div>
      )}
    </div>
  );
}
