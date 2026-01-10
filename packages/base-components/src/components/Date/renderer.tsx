import { ComponentRenderer } from '@game-cms/core';
import { DatePicker } from '@game-cms/ui';

export const renderer: ComponentRenderer<'base::date'> = ({
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
