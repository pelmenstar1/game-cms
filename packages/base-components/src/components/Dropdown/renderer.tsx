import { ComponentDefaultRenderer } from '@game-cms/core';
import { Select } from '@game-cms/ui';

export const renderer: ComponentDefaultRenderer<'base::dropdown'> = ({
  data,
  options,
  readOnly,
  onDataChanged,
}) => {
  return (
    <Select
      items={options.items}
      selectedItem={data}
      onItemSelected={onDataChanged}
      openDisabled={readOnly}
      placeholder=""
    />
  );
};
