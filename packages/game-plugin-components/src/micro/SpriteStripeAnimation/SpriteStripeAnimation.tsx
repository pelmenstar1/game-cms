import { classNames } from '@game-cms/ui';
import { SyntheticEvent } from 'react';

import { SpriteStripeInfo } from '../SpriteStripePreview/types';
import styles from './SpriteStripeAnimation.module.scss';

type OnImageLoadedInfo = {
  width: number;
  height: number;
};

export interface SpriteStripeAnimationProps extends SpriteStripeInfo {
  className?: string;
  frameIndex: number;
  onImageLoaded?: (info: OnImageLoadedInfo) => void;
}

export function SpriteStripeAnimation({
  className,
  imageUrl,
  frameWidth,
  frameHeight,
  frameIndex,
  onImageLoaded,
}: SpriteStripeAnimationProps) {
  const onLoad = (event: SyntheticEvent) => {
    const target = event.target as HTMLImageElement;

    onImageLoaded?.({
      width: target.naturalWidth,
      height: target.naturalHeight,
    });
  };

  return (
    <div
      className={classNames(styles['root'], className)}
      style={{ aspectRatio: `${frameWidth} / ${frameHeight}` }}
    >
      <img
        src={imageUrl}
        onLoad={onLoad}
        draggable={false}
        style={{
          '--frame-index': frameIndex,
        }}
      />
    </div>
  );
}
