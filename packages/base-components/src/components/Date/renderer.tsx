import { ComponentDefaultRenderer } from '@game-cms/core';
import { DatePicker } from '@game-cms/ui';

import { Id } from './types.js';

export const renderer: ComponentDefaultRenderer<Id> = ({
  data,
  options,
  onDataChanged,
}) => {
  return (
    <DatePicker
      min={options.minDate}
      max={options.maxDate}
      value={data}
      onValueChanged={onDataChanged}
    />
  );
};
