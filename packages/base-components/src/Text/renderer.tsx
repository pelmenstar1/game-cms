import { ComponentRenderer } from '@game-cms/types';
import { TextInput } from '@game-cms/ui';

import styles from './renderer.module.scss';

export const renderer: ComponentRenderer<'base::text'> = ({
  data,
  onDataChanged,
}) => {
  return (
    <TextInput
      className={styles.root}
      value={data}
      onTextChanged={onDataChanged}
    />
  );
};
