import { ConditionalData } from '@game-cms/conditional';
import { ComponentData, ComponentId, ComponentOptions } from '@game-cms/types';

export type AlternativeOptions<
  BaseOptions extends ComponentOptions = ComponentOptions,
  Id extends ComponentId = ComponentId,
> = {
  componentId: Id;
  baseOptions: BaseOptions;
};

export type AlternativeData<Data extends ComponentData = ComponentData> =
  ConditionalData<Data>;

export type AlternativeClientData<Data extends ComponentData = ComponentData> =
  ConditionalData<Data, string>;

export type AlternativeError<BaseError = unknown> = {
  default: BaseError | undefined;
  alternative: {
    data: BaseError | undefined;
    condition: string | undefined;
  }[];
};
