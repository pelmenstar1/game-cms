import { classNames, useBounds } from '@game-cms/ui';
import { useEffect, useRef } from 'react';

import { SpritesheetDataWithSize } from '../../../../utils/spritesheet/types';
import { usePreviewTabContext } from '../context';
import styles from './SpritesheetMap.module.scss';

export interface SpritesheetMapProps {
  className?: string;
  spritesheet: SpritesheetDataWithSize;
  displayAllFrames?: boolean;
}

export function SpritesheetMap({
  className,
  spritesheet,
  displayAllFrames,
}: SpritesheetMapProps) {
  const { selectedFrame, setSelectedFrame } = usePreviewTabContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const { width, height } = useBounds(canvasRef);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext('2d');

      contextRef.current = ctx;
    }
  }, []);

  useEffect(() => {
    const ctx = contextRef.current;
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#f00';
    ctx.lineWidth = 1;

    for (const [name, frame] of Object.entries(spritesheet.frames)) {
      const { x, y, w, h } = frame.frame;
      const isSelected = selectedFrame === name;

      if (!displayAllFrames && !isSelected) continue;

      ctx.setLineDash(isSelected ? [4, 4] : []);
      ctx.strokeRect(x, y, w, h);
    }
  }, [spritesheet, displayAllFrames, selectedFrame, width, height]);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const px = (e.clientX - rect.left) * (canvas.width / rect.width);
    const py = (e.clientY - rect.top) * (canvas.height / rect.height);

    const { frames } = spritesheet;

    for (const name in frames) {
      const { x, y, w, h } = frames[name].frame;

      if (px >= x && px <= x + w && py >= y && py <= y + h) {
        setSelectedFrame(name);
        return;
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className={classNames(styles.root, className)}
      width={width}
      height={height}
      onPointerMove={handlePointerMove}
    />
  );
}
