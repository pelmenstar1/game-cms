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
import styles from './SpineController.module.scss';

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
  const [animationTime, setAnimationTime] = useState(0);
  const [animationDuration, setAnimationDuration] = useState(0);
  const [speed, setSpeed] = useState(1);

  const onAnimationsLoaded = useCallback((names: string[]) => {
    setAnimations(names);
    setSelectedAnimation(names[0]);
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
        animationTime={animationTime}
        animationDuration={animationDuration}
        speed={speed}
        onRunningChanged={setRunning}
        onAnimationTimeChanged={onSliderTimeChanged}
        onSpeedChanged={setSpeed}
        onExportFrame={onExportFrame}
        onFit={onFit}
      />

      <AnimationList
        className={styles['animation-list']}
        animations={animations ?? []}
        selectedAnimation={selectedAnimation}
        onAnimationSelected={onAnimationSelected}
      />

      <Suspense fallback={null}>
        <SpineRenderer
          ref={rendererRef}
          className={styles['renderer']}
          spine={spine}
          animation={selectedAnimation}
          isRunning={isRunning}
          speed={speed}
          onAnimationsLoaded={onAnimationsLoaded}
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
