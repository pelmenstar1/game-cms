import type { ApiErrorStatusMap } from '@game-cms/base-types';

declare module '@game-cms/base-types' {
  interface ApiErrorCodeMap {
    base: {
      entity: ['notFound', 'duplicate'];
      schema: ['validation'];
      access: ['unauthorized', 'expired'];
      server: ['interalError'];
    };
  }
}

export const errorStatuses: ApiErrorStatusMap = {
  'base::access/expired': 401,
  'base::access/unauthorized': 401,
  'base::entity/duplicate': 409,
  'base::entity/notFound': 404,
  'base::server/interalError': 500,
};
