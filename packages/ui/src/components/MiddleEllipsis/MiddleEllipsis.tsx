import { type ComponentProps, useLayoutEffect, useRef, useState } from 'react';

import { useBounds } from '../../hooks';
import { Typography, type TypographyProps } from '../Typography';

export interface MiddleEllipsisProps
  extends TypographyProps, Omit<ComponentProps<'p'>, 'children'> {
  children: string;
}

const ELLIPSIS = '…';
const LAST_SYMBOLS_COUNT = 4;

let _renderingContext: CanvasRenderingContext2D | undefined;

function renderingContext() {
  if (!_renderingContext) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Failed to create canvas rendering context');
    }

    _renderingContext = context;
  }

  return _renderingContext;
}

function binarySearch(
  max: number,
  match: number,
  getValue: (guess: number) => number
) {
  let min = 0;

  while (min <= max) {
    const guess = Math.floor((min + max) / 2);
    const compareVal = getValue(guess);

    if (compareVal === match) {
      return guess;
    } else if (compareVal < match) {
      min = guess + 1;
    } else {
      max = guess - 1;
    }
  }

  return max;
}

function fitText(element: HTMLParagraphElement, text: string, width: number) {
  const context = renderingContext();

  context.font = window.getComputedStyle(element).font;

  const fullWidth = context.measureText(text).width;

  if (fullWidth <= width) {
    return text;
  }

  const suffix = ELLIPSIS + text.slice(-LAST_SYMBOLS_COUNT);
  const suffixWidth = context.measureText(suffix).width;

  const maxCount = text.length - LAST_SYMBOLS_COUNT;
  const maxWidth = width - suffixWidth;

  const fitCount = binarySearch(
    maxCount,
    maxWidth,
    (guess) => context.measureText(text.slice(0, guess)).width
  );

  return text.slice(0, fitCount) + suffix;
}

export function MiddleEllipsis({ children, ...props }: MiddleEllipsisProps) {
  const ref = useRef<HTMLParagraphElement>(null);

  const size = useBounds(ref);
  const [effectiveText, setEffectiveText] = useState('');

  useLayoutEffect(() => {
    const element = ref.current;

    if (element) {
      setEffectiveText(fitText(element, children, size.width));
    }
  }, [children, size]);

  return (
    <Typography ref={ref} title={children} {...props}>
      {effectiveText}
    </Typography>
  );
}
