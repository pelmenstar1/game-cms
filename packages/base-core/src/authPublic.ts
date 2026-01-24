import type z from 'zod';

import type {
  getPublicPermissionsResponse,
  updatePublicPermissionsPayload,
} from './schema/authPublic.js';

export type GetPublicPermissionsResponse = z.infer<
  typeof getPublicPermissionsResponse
>;

export type UpdatePublicPermissionsPayload = z.infer<
  typeof updatePublicPermissionsPayload
>;
