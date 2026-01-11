import { ComponentRenderer } from '@game-cms/core';
import { JsonEditor } from '@game-cms/ui';

export const renderer: ComponentRenderer<'base::json'> = ({
  data,
  options,
  onDataChanged,
}) => {
  return (
    <JsonEditor
      text={data}
      allowEmpty={options.allowEmpty}
      onTextChanged={onDataChanged}
    />
  );
};
