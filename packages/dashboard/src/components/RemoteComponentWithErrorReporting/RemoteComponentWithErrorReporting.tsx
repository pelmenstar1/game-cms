import type {
  ComponentDataById,
  ComponentDataValidator,
  ComponentErrorById,
  ComponentId,
} from '@game-cms/types';
import { useCallback, useRef } from 'react';

import { useApiClient } from '@/hooks/useApiClient';
import { getCachedClientModule } from '@/services/component/clientModule';

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
      } else {
        onDataChanged?.(data, undefined);

        if (validator !== undefined) {
          const worker = async () => {
            const { validator } = await getCachedClientModule(componentId, {
              client,
            });

            validatorRef.current = validator;

            if (validator) {
              const data = dataRef.current;

              onDataChanged?.(data, validator(data, options));
            }
          };

          void worker();
        }
      }
    },
    [client, componentId, onDataChanged, options]
  );

  return (
    <RemoteComponent
      componentId={componentId}
      data={data}
      options={options}
      error={error}
      onDataChanged={fixedOnDataChanged}
    />
  );
}
