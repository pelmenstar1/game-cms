import { ApiError, isApiError } from '@game-cms/core/api';
import { RequestFn } from '@game-cms/core/api/client';
import {
  NotificationContent,
  PageUrl,
  useNotification,
  useTypedNavigate,
} from '@game-cms/ui';
import { useCallback } from 'react';

import { ApiActionOptions } from '../../context/ApiClientContext.js';
import { useApiAction } from '../useApiAction.js';

export type EntityActionErrorHandler = (
  error: ApiError
) => NotificationContent | undefined;

export type UseAccessEntityArgs<
  Args extends unknown[],
  Options extends ApiActionOptions,
> = {
  queryFn: RequestFn<Args, unknown>;
  redirectOnSuccess: PageUrl;
  messageOnSuccess: string;
  messageOnFailure: string;
  errorHandlers?: EntityActionErrorHandler[];
  options?: Options;
};

export function useAccessEntity<
  Args extends unknown[],
  Options extends ApiActionOptions,
>({
  queryFn,
  errorHandlers,
  redirectOnSuccess,
  messageOnSuccess,
  messageOnFailure,
  options,
}: UseAccessEntityArgs<Args, Options>) {
  const action = useApiAction(queryFn, options);
  const notification = useNotification();
  const redirect = useTypedNavigate();

  return useCallback(
    (...args: Args) => {
      const worker = async () => {
        try {
          await action(...args);
          notification.info(messageOnSuccess);

          await redirect(redirectOnSuccess);
        } catch (error) {
          let content: NotificationContent | undefined;

          if (errorHandlers && isApiError(error)) {
            for (const handler of errorHandlers) {
              const result = handler(error);

              if (result) {
                content = result;
                break;
              }
            }
          }

          notification.error(content ?? messageOnFailure);
        }
      };

      void worker();
    },
    [
      action,
      notification,
      messageOnSuccess,
      redirect,
      redirectOnSuccess,
      errorHandlers,
      messageOnFailure,
    ]
  );
}
