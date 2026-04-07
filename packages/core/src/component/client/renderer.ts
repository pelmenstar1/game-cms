import { ReactNode } from 'react';

import {
  ComponentClientOptionsById,
  ComponentErrorById,
  ComponentId,
} from '../types.js';
import { ComponentClientDataById } from './types.js';

export interface ComponentRendererVariants<
  Id extends ComponentId = ComponentId,
> {
  default: ComponentDefaultRendererModule<Id>;
}

export type ComponentRendererVariant = keyof ComponentRendererVariants;
export type ComponentRendererByVariant<
  Variant extends ComponentRendererVariant,
  Id extends ComponentId = ComponentId,
> = ComponentRendererVariants<Id>[Variant];

export type ComponentDefaultRendererProps<Id extends ComponentId, Args> = {
  data: ComponentClientDataById<Id, Args>;
  options: ComponentClientOptionsById<Id, Args>;
  error?: ComponentErrorById<Id, Args>;
  readOnly?: boolean;
  onDataChanged?: (data: ComponentClientDataById<Id, Args>) => void;
};

export type ComponentDefaultRenderer<Id extends ComponentId = ComponentId> = <
  Args = unknown,
>(
  props: ComponentDefaultRendererProps<Id, Args>
) => ReactNode;

export interface ComponentDefaultRendererModule<
  Id extends ComponentId = ComponentId,
> {
  renderer: ComponentDefaultRenderer<Id>;
}

declare module '@game-cms/core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentBuildMeta<Id extends ComponentId> {
    renderers: ComponentRendererVariant[];
  }
}
