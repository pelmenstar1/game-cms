import { ApiErrorStatusMap, ApiErrorTypeInfo } from '@game-cms/core/api';

declare module '@game-cms/core/api' {
  interface ApiErrorCodeMap {
    base: {
      entity: {
        notFound: ApiErrorTypeInfo;
        duplicate: ApiErrorTypeInfo;
      };
      entityCheck: {
        fail: ApiErrorTypeInfo<{
          details: {
            failedRunIds: string[];
          };
        }>;
      };
      schema: {
        validation: ApiErrorTypeInfo;
      };
      access: {
        unauthorized: ApiErrorTypeInfo;
        invalidToken: ApiErrorTypeInfo;
      };
      server: {
        internalError: ApiErrorTypeInfo;
      };
      route: {
        notFound: ApiErrorTypeInfo;
      };
    };
  }
}

export const errorStatuses: ApiErrorStatusMap = {
  'base::access/invalidToken': 401,
  'base::access/unauthorized': 401,
  'base::entity/duplicate': 409,
  'base::entity/notFound': 404,
  'base::entityCheck/fail': 400,
  'base::server/internalError': 500,
};
