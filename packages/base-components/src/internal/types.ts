import { ComponentId, ComponentOptionsById } from '@game-cms/types';

export type ComponentGroupItem<Id extends ComponentId = ComponentId> = {
  componentId: Id;
  options: ComponentOptionsById<Id>;
};

export type ComponentGroup<T> = {
  [K in keyof T]: ComponentGroupItem;
};
