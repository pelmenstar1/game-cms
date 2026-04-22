import { ApiRouteId } from '@game-cms/core/api';
import type z from 'zod';

import type { updatePublicPermissionsPayload } from '../schema/authPublic.js';

export type GetPublicPermissionsResponse = {
  permissions: ApiRouteId[];
};

export type UpdatePublicPermissionsPayload = z.infer<
  typeof updatePublicPermissionsPayload
>;
