import {
  ComponentController,
  ComponentData,
  ComponentOptions,
} from '@game-cms/types';

/*@__NO_SIDE_EFFECTS__*/
export function defineComponent<
  Options extends ComponentOptions,
  Data extends ComponentData,
>(value: ComponentController<Options, Data>) {
  return value;
}
