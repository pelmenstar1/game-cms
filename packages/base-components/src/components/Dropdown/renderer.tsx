import { ComponentDefaultRenderer } from '@game-cms/core';
import { Select } from '@game-cms/ui';

export const renderer: ComponentDefaultRenderer<'base::dropdown'> = ({
  data,
  options,
  readonly,
  onDataChanged,
}) => {
  return (
    <Select
      items={options.items}
      selectedItem={data}
      onItemSelected={onDataChanged}
      openDisabled={readonly}
      placeholder=""
    />
  );
};
