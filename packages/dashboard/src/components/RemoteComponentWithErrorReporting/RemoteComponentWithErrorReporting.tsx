import type {
  ComponentDataById,
  ComponentDataValidator,
  ComponentErrorById,
  ComponentId,
} from '@game-cms/types';
import { useCallback, useEffect, useRef } from 'react';

import { useApiClient } from '@/hooks/useApiClient';
import { getCachedClientModule } from '@/services/component/clientModule';
import {
  ComponentErrorPending,
  resolveComponentError,
} from '@/services/entity/error';

import { RemoteComponent, type RemoteComponentProps } from '../RemoteComponent';

export interface RemoteComponentWithErrorReportingProps<
  Id extends ComponentId,
> extends Omit<RemoteComponentProps<Id>, 'onDataChanged'> {
  onDataChanged?: (
    data: ComponentDataById<Id>,
    error: ComponentErrorById<Id> | undefined
  ) => void;
}

const VALIDATOR_NOT_LOADED = Symbol();

export function RemoteComponentWithErrorReporting<Id extends ComponentId>({
  componentId,
  data,
  options,
  error,
  onDataChanged,
}: RemoteComponentWithErrorReportingProps<Id>) {
  const client = useApiClient();

  const validatorRef = useRef<
    ComponentDataValidator | undefined | typeof VALIDATOR_NOT_LOADED
  >(VALIDATOR_NOT_LOADED);
  const dataRef = useRef(data);
  const onDataChangedRef = useRef(onDataChanged);

  const fixedOnDataChanged = useCallback(
    (data: ComponentDataById<Id>) => {
      dataRef.current = data;

      const validator = validatorRef.current;

      if (validator === undefined || validator !== VALIDATOR_NOT_LOADED) {
        onDataChanged?.(data, validator?.(data, options));
      } else {
        const worker = async () => {
          const { validator } = await getCachedClientModule(componentId, {
            client,
          });

          validatorRef.current = validator;

          const data = dataRef.current;
          const onDataChanged = onDataChangedRef.current;

          const error = validator?.(data, options);

          onDataChanged?.(data, error);
        };

        onDataChanged?.(data, ComponentErrorPending);

        void worker();
      }
    },
    [client, componentId, onDataChanged, options]
  );

  useEffect(() => {
    fixedOnDataChanged(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    onDataChangedRef.current = onDataChanged;
  }, [onDataChanged]);

  return (
    <RemoteComponent
      componentId={componentId}
      data={data}
      options={options}
      error={resolveComponentError(error)}
      onDataChanged={fixedOnDataChanged}
    />
  );
}
