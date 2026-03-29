import { createEnvAccessor } from '@game-cms/shared/node';

const env = createEnvAccessor();

export function cmsUrl() {
  return env('CMS_URL');
}

export function cmsApiToken() {
  return env('CMS_API_TOKEN');
}
