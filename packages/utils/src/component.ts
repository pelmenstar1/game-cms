import type {
  ComponentController,
  ComponentMeta,
  ComponentSchema,
} from '@game-cms/types';

export function componentAccessor<Id extends string>(
  controller: ComponentController<Id>
) {
  return <Args>(
    input: Omit<ComponentSchema<Id, Args>, 'componentId' | 'config'>
  ): ComponentSchema<Id, Args> => {
    return { componentId: controller.meta.id, ...input };
  };
}

export function componentMeta<Id extends string>(value: ComponentMeta<Id>) {
  return value;
}
