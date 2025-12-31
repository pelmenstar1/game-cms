import type {
  ComponentController,
  ComponentMeta,
  ComponentSchema,
} from '@game-cms/types';

export function componentAccessor<Id extends string, Args>(
  controller: ComponentController<Id, Args>
) {
  return (
    input: Omit<ComponentSchema<Id, Args>, 'componentId' | 'config'>
  ): ComponentSchema<Id, Args> => {
    return { componentId: controller.meta.id, ...input };
  };
}

export function componentMeta<Id extends string>(value: ComponentMeta<Id>) {
  return value;
}
