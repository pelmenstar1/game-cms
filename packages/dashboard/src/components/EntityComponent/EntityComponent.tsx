import type { EntityId } from '@game-cms/base-types';
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
  onDataChanged: (data: RawConditionalChoicesById<T>) => void;
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
  const { alternative } = data;
  const alternativeItems = alternative.map((choice, i) => ({
    key: i,
    ...choice,
  }));

  const onItemsChanged = (items: RawConditionalAlternativeChoiceById<T>[]) => {
    onDataChanged({ default: data.default, alternative: items });
  };

  const onAddItem = () => {
    onDataChanged({
      default: data.default,
      alternative: [
        ...alternative,
        { condition: '', error: undefined, value: defaultData },
      ],
    });
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
          onDataChanged={(newDefault, error) => {
            onDataChanged({
              default: { value: newDefault, error },
              alternative: data.alternative,
            });
          }}
        />
      </div>

      {alternativeItems.length > 0 && (
        <DraggableList
          className={styles['alternative-list']}
          items={alternativeItems}
          onItemsChanged={onItemsChanged}
        >
          {({ key, ...choice }, _, handleRef) => (
            <EntityComponentChoice
              componentId={componentId}
              choice={choice}
              options={options}
              handleRef={handleRef}
              onChoiceChanged={(newChoice) => {
                const newAlternative = [...alternative];
                newAlternative[key] = newChoice;

                onDataChanged({
                  default: data.default,
                  alternative: newAlternative,
                });
              }}
              onDelete={() => {
                const newAlternative = [...alternative];
                newAlternative.splice(key, 1);

                onDataChanged({
                  default: data.default,
                  alternative: newAlternative,
                });
              }}
            />
          )}
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
