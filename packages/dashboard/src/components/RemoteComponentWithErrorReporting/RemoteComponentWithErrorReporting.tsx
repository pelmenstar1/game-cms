import { useComponentApi } from '@game-cms/component-api';
import type {
  ComponentDataById,
  ComponentErrorById,
  ComponentId,
  ComponentOptionsById,
} from '@game-cms/types';
import { useCallback, useEffect } from 'react';

import { useComponentHub } from '@/hooks/useComponentHub';

export interface RemoteComponentWithErrorReportingProps<
  Id extends ComponentId,
> {
  componentId: Id;
  data: ComponentDataById<Id>;
  options: ComponentOptionsById<Id>;
  error?: ComponentErrorById<Id>;
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
  const api = useComponentApi();
  const { validationContext } = useComponentHub();

  const fixedOnDataChanged = useCallback(
    (data: ComponentDataById<Id>) => {
      const error = validationContext.data(componentId, data, options);

      onDataChanged?.(data, error);
    },
    [componentId, validationContext, onDataChanged, options]
  );

  useEffect(() => {
    fixedOnDataChanged(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Component = api.getComponent(componentId);

  return (
    <Component
      data={data}
      options={options}
      error={error}
      onDataChanged={fixedOnDataChanged}
    />
  );
}
