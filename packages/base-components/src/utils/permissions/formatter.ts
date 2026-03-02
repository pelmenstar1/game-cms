import { capitalizeFirstLetter } from '@game-cms/shared/string';

export function formatPermissionName(name: string) {
  const parts = name.split('/');

  return parts.map((part) => capitalizeFirstLetter(part)).join(' / ');
}
