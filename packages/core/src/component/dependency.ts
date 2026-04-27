import { ComponentId, ComponentOptionsById } from './types.js';

export interface ForeignComponentDependencySourceContext {
  getDependencies: <Id extends ComponentId, Args>(
    id: Id,
    options: ComponentOptionsById<Id, Args>
  ) => ComponentId[];
}

export type ComponentDependencySource<Id extends ComponentId = ComponentId> =
  | ComponentId[]
  | (<Args>(
      options: ComponentOptionsById<Id, Args>,
      context: ForeignComponentDependencySourceContext
    ) => ComponentId[]);
