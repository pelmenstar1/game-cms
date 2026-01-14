import { removeIndex } from '@game-cms/shared/collections';
import {
  classNames,
  DeleteIcon,
  IconButton,
  PlusIcon,
  TextInput,
} from '@game-cms/ui';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './ResolveArgsInput.module.scss';

export type ArgItem = {
  name: string;
  value: string;
};

export interface ResolveArgsInputProps {
  className?: string;

  args: ArgItem[];
  onArgsChanged: (value: ArgItem[]) => void;
}

export function ResolveArgsInput({
  className,
  args,
  onArgsChanged,
}: ResolveArgsInputProps) {
  const { t } = useTranslation('base', {
    keyPrefix: 'micro.ResolveArgsInput',
  });

  const onAddArg = useCallback(() => {
    onArgsChanged([...args, { name: '', value: '' }]);
  }, [args, onArgsChanged]);

  return (
    <div className={classNames(styles.root, className)}>
      {args.map(({ name, value }, i) => {
        const onPropertyChanged = (key: keyof ArgItem, propValue: string) => {
          const newArgs = [...args];
          newArgs[i] = { name, value, [key]: propValue };

          onArgsChanged(newArgs);
        };

        const onDelete = () => {
          onArgsChanged(removeIndex(args, i));
        };

        return (
          <div key={i} className={styles.item}>
            <TextInput
              weight="bold"
              className={styles['item-name']}
              variant="underline"
              value={name}
              onTextChanged={(name) => {
                onPropertyChanged('name', name);
              }}
            />
            <TextInput
              weight="bold"
              className={styles['item-value']}
              variant="underline"
              value={value}
              onTextChanged={(value) => {
                onPropertyChanged('value', value);
              }}
            />

            <IconButton
              onClick={onDelete}
              className={styles['item-delete']}
              hover="fill"
              title={t('deleteArg')}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        );
      })}

      <IconButton
        title={t('addArg')}
        onClick={onAddArg}
        className={styles['add']}
      >
        <PlusIcon />
      </IconButton>
    </div>
  );
}
