import { SettingsTabMap } from '@game-cms/base-core';

export const settings: SettingsTabMap = {
  'base::entityCheck::review': {
    title: 'Review',
    href: 'review',
    permission: 'entityCheck/base::review/reviewers$get',
  },
};
