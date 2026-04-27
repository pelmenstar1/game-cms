import {
  ComponentId,
  ComponentInDataById,
  ForeignComponentStorageDataTransformerContext,
} from '@game-cms/core';
import { MaybePromise } from '@game-cms/shared';

import { GameAssetPipelineStepDataOptions } from '../core.js';

export type SpritesheetStepSourceResult = Record<
  string,
  { file: string; name: string }[]
>;

export type SpritesheetStepSource = <CId extends ComponentId, Args>(
  inData: ComponentInDataById<CId, Args>,
  options: GameAssetPipelineStepDataOptions<CId, Args>,
  context: ForeignComponentStorageDataTransformerContext
) => MaybePromise<SpritesheetStepSourceResult>;

export type SpritesheetPathSourceOptions = {
  bundlePath: string;
  imagePath: string;
  namePath: string;
};

export function spritesheetPathSource({
  bundlePath,
  imagePath,
  namePath,
}: SpritesheetPathSourceOptions): SpritesheetStepSource {
  return (data, options, context) => {
    const bundles: string[] = [];
    const images: string[] = [];
    const names: string[] = [];

    context.applyAtPath(
      options.componentId,
      data,
      options.baseOptions,
      bundlePath,
      (result) => {
        bundles.push(result as string);
      }
    );

    context.applyAtPath(
      options.componentId,
      data,
      options.baseOptions,
      imagePath,
      (result) => {
        if (Array.isArray(result)) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const [image] = result;

          if (typeof image === 'string') {
            images.push(image);
          }
        }
      }
    );

    context.applyAtPath(
      options.componentId,
      data,
      options.baseOptions,
      namePath,
      (result) => {
        names.push(result as string);
      }
    );

    const result: SpritesheetStepSourceResult = {};

    for (let i = 0; i < images.length; i++) {
      const bundle = bundles[i];

      const list = (result[bundle] ??= []);

      list.push({ file: images[i], name: names[i] });
    }

    return result;
  };
}
