import { ComponentRenderer } from '@game-cms/core';
import { Select } from '@game-cms/ui';

export const renderer: ComponentRenderer<'base::dropdown'> = ({
  data,
  options,
  onDataChanged,
}) => {
  return (
    <Select
      items={options.items}
      selectedItem={data}
      onItemSelected={onDataChanged}
      placeholder=""
    />
  );
};
