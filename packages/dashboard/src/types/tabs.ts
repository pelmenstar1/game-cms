import type { ApiRouteId } from '@game-cms/core/api';
import type { NavTabInfo } from '@game-cms/ui';

export interface NavTabInfoWithPermission extends NavTabInfo {
  permission: ApiRouteId;
}
