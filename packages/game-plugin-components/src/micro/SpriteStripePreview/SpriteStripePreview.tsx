import { classNames } from '@game-cms/ui';
import { useEffect, useState } from 'react';

import { SpriteStripeAnimation } from '../SpriteStripeAnimation';
import { Header } from './Header';
import styles from './SpriteStripePreview.module.scss';
import { SpriteStripeInfo } from './types';

export interface SpriteStripePreviewProps extends SpriteStripeInfo {
  className?: string;
}

export function SpriteStripePreview({
  className,
  imageUrl,
  frameWidth,
  frameHeight,
}: SpriteStripePreviewProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [maxFrameIndex, setMaxFrameIndex] = useState(0);

  const onImageLoaded = (info: { width: number; height: number }) => {
    const columns = Math.floor(info.width / frameWidth);

    setMaxFrameIndex(columns - 1);
  };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setFrameIndex((prev) => (prev + 1) % (maxFrameIndex + 1));
      }, 100);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isRunning, maxFrameIndex]);

  return (
    <div className={classNames(styles['root'], className)}>
      <Header
        frameIndex={frameIndex}
        maxFrameIndex={maxFrameIndex}
        isRunning={isRunning}
        onFrameIndexChanged={setFrameIndex}
        onRunningChanged={setIsRunning}
      />

      <SpriteStripeAnimation
        imageUrl={imageUrl}
        frameWidth={frameWidth}
        frameHeight={frameHeight}
        frameIndex={frameIndex}
        onImageLoaded={onImageLoaded}
      />
    </div>
  );
}
