import { DASHBOARD_COMPONENTS_PATH } from '@game-cms/build';
import { readJson } from '@game-cms/shared/io';
import type { ComponentsFsInfo } from '@game-cms/types';

export function readComponentsFsInfo() {
  return readJson<ComponentsFsInfo>(DASHBOARD_COMPONENTS_PATH);
}
