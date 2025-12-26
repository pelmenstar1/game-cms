import { type ComponentProps, useCallback, useRef, useState } from 'react';

import { classNames } from '../../utils/classNames';
import { IndeterminateCircularProgress } from '../IndeterminateCircularProgress';
import { SpineRenderer, type SpineRendererRefType } from '../SpineRenderer';
import type { SpineData } from '../SpineRenderer/types';
import { AnimationList } from './AnimationList';
import { Header } from './Header';
import styles from './SpineController.module.scss';

export interface SpineControllerProps extends ComponentProps<'div'> {
  spine: SpineData;
}

export function SpineController({
  className,
  spine,
  ...rest
}: SpineControllerProps) {
  const timeSliderRef = useRef<SpineRendererRefType>(null);

  const [isRunning, setRunning] = useState(true);
  const [selectedAnimation, setSelectedAnimation] = useState<string>();
  const [animations, setAnimations] = useState<string[] | undefined>();
  const [animationTime, setAnimationTime] = useState(0);
  const [speed, setSpeed] = useState(1);

  const onAnimationsLoaded = useCallback((names: string[]) => {
    setAnimations(names);
    setSelectedAnimation(names[0]);
  }, []);

  const onSliderTimeChanged = useCallback((time: number) => {
    setAnimationTime(time);

    timeSliderRef.current?.setTime(time);
  }, []);

  const onAnimationSelected = useCallback((name: string) => {
    setSelectedAnimation(name);
    setAnimationTime(0);
  }, []);

  return (
    <div className={classNames(styles.root, className)} {...rest}>
      <Header
        className={styles.header}
        isRunning={isRunning}
        animationTime={animationTime}
        speed={speed}
        onRunningChanged={setRunning}
        onAnimationTimeChanged={onSliderTimeChanged}
        onSpeedChanged={setSpeed}
      />

      <AnimationList
        className={styles['animation-list']}
        animations={animations ?? []}
        selectedAnimation={selectedAnimation}
        onAnimationSelected={onAnimationSelected}
      />

      <SpineRenderer
        ref={timeSliderRef}
        className={styles['renderer']}
        spine={spine}
        animation={selectedAnimation}
        isRunning={isRunning}
        speed={speed}
        onAnimationsLoaded={onAnimationsLoaded}
        onAnimationTimeChanged={setAnimationTime}
      />

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
