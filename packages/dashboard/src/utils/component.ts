import type { ComponentRenderer } from '@game-cms/types';

export function getRendererFromModule(value: unknown): ComponentRenderer {
  if (typeof value !== 'object' || value === null) {
    throw new Error('Module is not an object');
  }

  const { renderer } = value as { renderer: unknown };

  if (typeof renderer !== 'function') {
    throw new TypeError('Renderer is not a function');
  }

  return renderer as ComponentRenderer;
}
