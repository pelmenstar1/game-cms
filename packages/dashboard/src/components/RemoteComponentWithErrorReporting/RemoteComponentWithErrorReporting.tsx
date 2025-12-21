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

export function RemoteComponentWithErrorReporting<Id extends ComponentId>({
  componentId,
  data,
  options,
  error,
  onDataChanged,
}: RemoteComponentWithErrorReportingProps<Id>) {
  const client = useApiClient();

  const validatorRef = useRef<ComponentDataValidator | undefined>(null);
  const dataRef = useRef(data);

  const fixedOnDataChanged = useCallback(
    (data: ComponentDataById<Id>) => {
      dataRef.current = data;

      const validator = validatorRef.current;

      if (validator) {
        onDataChanged?.(data, validator(data, options));
      } else if (validator !== undefined) {
        const worker = async () => {
          const { validator } = await getCachedClientModule(componentId, {
            client,
          });

          validatorRef.current = validator;

          if (validator) {
            const data = dataRef.current;

            onDataChanged?.(data, validator(data, options));
          } else {
            onDataChanged?.(data, undefined);
          }
        };

        onDataChanged?.(data, ComponentErrorPending);

        void worker();
      } else {
        onDataChanged?.(data, undefined);
      }
    },
    [client, componentId, onDataChanged, options]
  );

  useEffect(() => {
    fixedOnDataChanged(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
