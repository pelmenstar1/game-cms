import type { EntityId } from '@game-cms/base-types';
import { resolveMaybeFactory } from '@game-cms/shared';
import type {
  ComponentDataById,
  ComponentId,
  ComponentOptionsById,
} from '@game-cms/types';
import {
  classNames,
  DraggableList,
  IconButton,
  Labeled,
  PlusIcon,
  Typography,
} from '@game-cms/ui';
import type { SetStateAction } from 'react';

import { ComponentErrorPending } from '@/services/entity/error';
import type {
  RawConditionalAlternativeChoiceById,
  RawConditionalChoicesById,
} from '@/types/conditional';

import { EntityComponentChoice } from '../EntityComponentChoice';
import { RemoteComponentWithErrorReporting } from '../RemoteComponentWithErrorReporting';
import styles from './EntityComponent.module.scss';

export interface EntityComponentProps<T extends ComponentId> {
  className?: string;
  title: string;
  componentId: T;
  options: ComponentOptionsById<T>;
  data: RawConditionalChoicesById<T>;
  defaultData: ComponentDataById<T>;
  onDataChanged: (data: SetStateAction<RawConditionalChoicesById<T>>) => void;
}

export function EntityComponent<T extends EntityId>({
  className,
  title,
  componentId,
  options,
  defaultData,
  data,
  onDataChanged,
}: EntityComponentProps<T>) {
  const alternativeItems = data.alternative.map((choice, i) => ({
    key: i,
    ...choice,
  }));

  const onItemsChanged = (items: RawConditionalAlternativeChoiceById<T>[]) => {
    onDataChanged((data) => ({ default: data.default, alternative: items }));
  };

  const onAddItem = () => {
    onDataChanged((data) => ({
      default: data.default,
      alternative: [
        ...data.alternative,
        {
          condition: { raw: '', expression: null, error: 'Condition is empty' },
          data: {
            value: defaultData,
            error: ComponentErrorPending,
          },
        },
      ],
    }));
  };

  return (
    <Labeled title={title} className={classNames(styles.root, className)}>
      <div className={styles['default-choice']}>
        <Typography className={styles['default-choice-label']}>
          Default
        </Typography>

        <RemoteComponentWithErrorReporting
          componentId={componentId}
          options={options}
          data={data.default.value}
          error={data.default.error}
          onDataChanged={(value, error) => {
            onDataChanged((data) => ({
              default: { value, error },
              alternative: data.alternative,
            }));
          }}
        />
      </div>

      {alternativeItems.length > 0 && (
        <DraggableList
          className={styles['alternative-list']}
          items={alternativeItems}
          onItemsChanged={onItemsChanged}
        >
          {({ key, ...choice }, _, handleRef) => {
            const onChoiceChanged = (
              choice: SetStateAction<RawConditionalAlternativeChoiceById<T>>
            ) => {
              onDataChanged((data) => {
                const newAlternative = [...data.alternative];
                newAlternative[key] = resolveMaybeFactory(
                  choice,
                  data.alternative[key]
                );

                return {
                  default: data.default,
                  alternative: newAlternative,
                };
              });
            };

            const onDelete = () => {
              onDataChanged((data) => {
                const newAlternative = [...data.alternative];
                newAlternative.splice(key, 1);

                return {
                  default: data.default,
                  alternative: newAlternative,
                };
              });
            };

            return (
              <EntityComponentChoice
                componentId={componentId}
                choice={choice}
                options={options}
                handleRef={handleRef}
                onChoiceChanged={onChoiceChanged}
                onDelete={onDelete}
              />
            );
          }}
        </DraggableList>
      )}

      <IconButton
        className={styles['add-alternative-button']}
        title="Add alternative"
        onClick={onAddItem}
      >
        <PlusIcon />
      </IconButton>
    </Labeled>
  );
}
