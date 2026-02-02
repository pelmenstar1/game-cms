import { ApiErrorStatusMap } from '@game-cms/core/api';

declare module '@game-cms/base-core' {
  interface ApiErrorCodeMap {
    base: {
      entity: ['notFound', 'duplicate'];
      schema: ['validation'];
      access: ['unauthorized', 'expired'];
      server: ['internalError'];
      route: ['notFound'];
    };
  }
}

export const errorStatuses: ApiErrorStatusMap = {
  'base::access/expired': 401,
  'base::access/unauthorized': 401,
  'base::entity/duplicate': 409,
  'base::entity/notFound': 404,
  'base::server/internalError': 500,
};
