import type {
  ApiToken,
  ResolveServices,
  ServerStorageFile,
  ServerUser,
  StorageFolder,
} from '@game-cms/types';

type Services = [
  typeof import('./entity.js'),
  typeof import('./component.js'),
  typeof import('./database.js'),
  typeof import('./entitySchema.js'),
  typeof import('./user.js'),
  typeof import('./auth.js'),
  typeof import('./apiToken.js'),
  typeof import('./file.js'),
  typeof import('./folder.js'),
];

declare module '@game-cms/types' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface GameCmsServiceMap extends ResolveServices<Services> {}

  interface DatabaseEntityMap {
    'base::users': ServerUser;
    'base::apiTokens': ApiToken;
    'base::files': ServerStorageFile;
    'base::folders': StorageFolder;
  }
}
