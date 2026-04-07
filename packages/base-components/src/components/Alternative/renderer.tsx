import { useComponentApi } from '@game-cms/component-api';
import {
  ComponentClientDataById,
  ComponentDefaultRendererProps,
} from '@game-cms/core';
import { removeIndex, withUpdatedItem } from '@game-cms/shared/collections';
import {
  DraggableList,
  IconButton,
  namedLazy,
  PlusIcon,
  PreviewIcon,
  Typography,
  useModal,
} from '@game-cms/ui';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { EntityComponentChoice } from '../../micro/EntityComponentChoice/index.js';
import styles from './renderer.module.scss';

const AlternativeTestModal = namedLazy(
  () => import('../../micro/AlternativeTestModal/index.js'),
  'AlternativeTestModal'
);

type Id = 'base::alternative';

export const renderer = <Args,>({
  data,
  options,
  error,
  readOnly,
  onDataChanged,
}: ComponentDefaultRendererProps<Id, Args>) => {
  type ItemData = ComponentClientDataById<Id, Args>['default'];

  const { t } = useTranslation('base', {
    keyPrefix: 'components.Alternative',
  });

  const api = useComponentApi();
  const showModal = useModal();

  const { baseOptions, componentId } = options;
  const BaseComponent = api.getDefaultRenderer(componentId);

  const alternativeItems = data.alternative.map((choice, i) => ({
    key: i,
    ...choice,
  }));

  const onDefaultChange = (newDefault: ItemData) => {
    onDataChanged?.({
      alternative: data.alternative,
      default: newDefault,
    });
  };

  const onAlternativeItemsChanged = (newItems: typeof alternativeItems) => {
    onDataChanged?.({
      default: data.default,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      alternative: newItems.map(({ key, ...rest }) => rest),
    });
  };

  const onAddItem = () => {
    onDataChanged?.({
      default: data.default,
      alternative: [
        ...alternativeItems,
        {
          condition: '',
          value: api.getDefaultData(componentId, baseOptions),
        },
      ],
    });
  };

  const onShowTestModal = useCallback(() => {
    void showModal(AlternativeTestModal, {
      data,
      options,
    });
  }, [data, options, showModal]);

  return (
    <div className={styles['root']}>
      <div className={styles['header']}>
        <IconButton
          onClick={onShowTestModal}
          title={t('openTest')}
          disabled={error !== undefined}
        >
          <PreviewIcon />
        </IconButton>
      </div>

      <div className={styles['default-choice']}>
        <Typography className={styles['default-choice-label']}>
          {t('default')}
        </Typography>

        <BaseComponent
          data={data.default}
          options={baseOptions}
          error={error?.default}
          readOnly={readOnly}
          onDataChanged={onDefaultChange}
        />
      </div>

      {alternativeItems.length > 0 && (
        <DraggableList
          className={styles['alternative-list']}
          items={alternativeItems}
          onItemsChanged={onAlternativeItemsChanged}
        >
          {(item, _, handleRef) => {
            const onItemDataChanged = (value: ItemData) => {
              const newAlternative = withUpdatedItem(
                data.alternative,
                item.key,
                { ...data.alternative[item.key], value }
              );

              onDataChanged?.({
                default: data.default,
                alternative: newAlternative,
              });
            };

            const onItemConditionChanged = (condition: string) => {
              const newAlternative = withUpdatedItem(
                data.alternative,
                item.key,
                { ...data.alternative[item.key], condition }
              );

              onDataChanged?.({
                default: data.default,
                alternative: newAlternative,
              });
            };

            const onItemDelete = () => {
              onDataChanged?.({
                default: data.default,
                alternative: removeIndex(data.alternative, item.key),
              });
            };

            const itemError = error?.alternative?.[item.key];

            return (
              <EntityComponentChoice
                componentId={componentId}
                data={item.value}
                condition={item.condition}
                dataError={itemError?.data}
                conditionError={itemError?.condition}
                options={baseOptions}
                handleRef={handleRef}
                readOnly={readOnly}
                onDataChanged={onItemDataChanged}
                onConditionChanged={onItemConditionChanged}
                onDelete={onItemDelete}
              />
            );
          }}
        </DraggableList>
      )}

      {!readOnly && (
        <IconButton
          className={styles['add-alternative-button']}
          title={t('addItem')}
          onClick={onAddItem}
        >
          <PlusIcon />
        </IconButton>
      )}
    </div>
  );
};
