import { type ComponentProps, useLayoutEffect, useRef } from 'react';

import { useBounds } from '../../hooks';
import { Typography, type TypographyProps } from '../Typography';

export interface MiddleEllipsisProps
  extends TypographyProps, Omit<ComponentProps<'p'>, 'children'> {
  children: string | null | undefined;
}

const ELLIPSIS = '…';
const LAST_SYMBOLS_COUNT = 4;

let _renderingContext: CanvasRenderingContext2D | null | undefined;

function renderingContext() {
  if (_renderingContext === undefined) {
    const canvas = document.createElement('canvas');

    _renderingContext = canvas.getContext('2d');
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

function fitText(
  element: HTMLParagraphElement,
  text: string | null | undefined,
  width: number
) {
  text ??= '';

  const context = renderingContext();
  if (context === null) {
    return text;
  }

  const style = window.getComputedStyle(element);

  context.font = style.font;
  context.letterSpacing = style.letterSpacing;

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

  return text.slice(0, fitCount - 1) + suffix;
}

export function MiddleEllipsis({ children, ...props }: MiddleEllipsisProps) {
  const ref = useRef<HTMLParagraphElement>(null);

  const size = useBounds(ref);

  useLayoutEffect(() => {
    const element = ref.current;

    if (element) {
      element.textContent = fitText(element, children, size.width);
    }
  }, [children, size]);

  return <Typography ref={ref} title={children} {...props} />;
}
