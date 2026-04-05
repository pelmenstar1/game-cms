import { ComponentDefaultRenderer } from '@game-cms/core';
import { DatePicker } from '@game-cms/ui';

export const renderer: ComponentDefaultRenderer<'base::date'> = ({
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
