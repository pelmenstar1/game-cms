import { ComponentDefaultRenderer } from '@game-cms/core';
import { Select } from '@game-cms/ui';

import { Id } from './types.js';

export const renderer: ComponentDefaultRenderer<Id> = ({
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
