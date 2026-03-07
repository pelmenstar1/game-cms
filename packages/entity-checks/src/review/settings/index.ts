import { SettingsTab } from '@game-cms/base-core';

export const settings: SettingsTab[] = [
  {
    text: 'Review',
    href: 'review',
    permission: 'entityCheck/base::review/reviewers$get',
  },
];
