import { ComponentId, ComponentOptions } from '@game-cms/types';

export type RepeatableOptions<
  BaseOptions extends ComponentOptions = ComponentOptions,
  Id extends ComponentId = ComponentId,
> = {
  controller: Id;
  base: BaseOptions;
};
