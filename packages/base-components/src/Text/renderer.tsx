import { ComponentRenderer } from '@game-cms/types';
import { TextInput } from '@game-cms/ui';

export const renderer: ComponentRenderer<'base::text'> = ({
  data,
  onDataChanged,
}) => {
  return <TextInput value={data} onTextChanged={onDataChanged} />;
};
