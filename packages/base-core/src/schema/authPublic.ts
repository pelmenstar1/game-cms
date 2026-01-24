import { apiRouteId } from '@game-cms/core/schema';
import z from 'zod';

export const getPublicPermissionsResponse = z.object({
  permissions: z.array(apiRouteId),
});

export const updatePublicPermissionsPayload = getPublicPermissionsResponse;
