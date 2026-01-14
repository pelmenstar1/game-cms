import { useComponentApi } from '@game-cms/component-api';
import {
  parseConditionalNotation,
  resolveConditionalData,
} from '@game-cms/conditional';
import { ComponentClientDataById, ComponentOptionsById } from '@game-cms/core';
import { ModalDialog, ModalProps } from '@game-cms/ui';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ArgItem } from '../ResolveArgsInput/index.js';
import { ResolveArgsInput } from '../ResolveArgsInput/ResolveArgsInput.js';
import styles from './AlternativeTestModal.module.scss';

export interface AlternativeTestModalProps<Args> extends ModalProps {
  data: ComponentClientDataById<'base::alternative', Args>;
  options: ComponentOptionsById<'base::alternative', Args>;
}

export function AlternativeTestModal<Args>({
  onClose,
  data,
  options: { componentId, baseOptions },
}: AlternativeTestModalProps<Args>) {
  const { t } = useTranslation('base', {
    keyPrefix: 'micro.AlternativeTestModal',
  });

  const api = useComponentApi();

  const BaseComponent = api.getComponent(componentId);

  const [args, setArgs] = useState<ArgItem[]>([]);

  const dataWithParsedCondition = useMemo(
    () => ({
      default: data.default,
      alternative: data.alternative.map((item) => ({
        condition: parseConditionalNotation(item.condition),
        value: item.value,
      })),
    }),
    [data]
  );

  const componentData = useMemo(() => {
    try {
      return resolveConditionalData(
        dataWithParsedCondition,
        Object.fromEntries(args.map(({ name, value }) => [name, value]))
      );
    } catch {
      return data.default;
    }
  }, [args, data, dataWithParsedCondition]);

  return (
    <ModalDialog
      onClose={onClose}
      contentClassName={styles.content}
      title={t('title')}
    >
      <ResolveArgsInput
        args={args}
        onArgsChanged={setArgs}
        className={styles.input}
      />

      <BaseComponent data={componentData} options={baseOptions} readonly />
    </ModalDialog>
  );
}
