import type {
  ComponentController,
  ComponentDataValidator,
  ComponentId,
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

export function componentDataValidator<Id extends ComponentId, Args = unknown>(
  value: ComponentDataValidator<Id, Args>
) {
  return value;
}
