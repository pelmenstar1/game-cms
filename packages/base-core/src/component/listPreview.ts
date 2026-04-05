import {
  ComponentId,
  ComponentOptionsById,
  ComponentOutDataById,
} from '@game-cms/core';
import { ReactNode } from 'react';

export type ComponentListPreviewProps<Id extends ComponentId, Args> = {
  data: ComponentOutDataById<Id, Args>;
  options: ComponentOptionsById<Id, Args>;
};

export type ComponentListPreviewRenderer<Id extends ComponentId = ComponentId> =
  <Args>(props: ComponentListPreviewProps<Id, Args>) => ReactNode;

export interface ComponentListPreviewModule<
  Id extends ComponentId = ComponentId,
> {
  listPreview: ComponentListPreviewRenderer<Id>;
}

declare module '@game-cms/core' {
  interface ComponentRendererVariants<Id extends ComponentId> {
    listPreview?: ComponentListPreviewModule<Id>;
  }
}
