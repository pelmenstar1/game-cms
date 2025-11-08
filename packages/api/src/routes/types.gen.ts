import type { ResolveRouteMetaArray } from '@game-cms/types';

export type Meta = ResolveRouteMetaArray<
  [
    { url: '/auth/token'; exported: typeof import('./auth/token/create.js') },
    { url: '/auth/token'; exported: typeof import('./auth/token/delete.js') },
    {
      url: '/auth/token/jwt';
      exported: typeof import('./auth/token/signin.js');
    },
    {
      url: '/auth/user/signin';
      exported: typeof import('./auth/user/signin.js');
    },
    {
      url: '/_components/:id/assets/*';
      exported: typeof import('./components/assets.js');
    },
    {
      url: '/_components/:id/manifest.json';
      exported: typeof import('./components/manifest.js');
    },
    {
      url: '/entity/:entityId/byId/:id';
      exported: typeof import('./entity/byId/delete.js');
    },
    {
      url: '/entity/:entityId/byId/:id';
      exported: typeof import('./entity/byId/get.js');
    },
    {
      url: '/entity/:entityId/byId/:id';
      exported: typeof import('./entity/byId/update.js');
    },
    { url: '/entity/:entityId'; exported: typeof import('./entity/create.js') },
    {
      url: '/entity/:entityId/list';
      exported: typeof import('./entity/list.js');
    },
    {
      url: '/entitySchema/byId/:id';
      exported: typeof import('./entitySchema/get.js');
    },
    {
      url: '/entitySchema/list';
      exported: typeof import('./entitySchema/list.js');
    },
    {
      url: '/file/byId/:fileId';
      exported: typeof import('./file/byId/delete.js');
    },
    {
      url: '/file/byId/:fileId';
      exported: typeof import('./file/byId/get.js');
    },
    { url: '/file/list'; exported: typeof import('./file/list/get.js') },
    { url: '/file'; exported: typeof import('./file/upload.js') },
    {
      url: '/assets/_s/:scope/:name.js';
      exported: typeof import('./sharedAssets/route.js');
    },
    { url: '/user/byId/:id'; exported: typeof import('./user/byId/delete.js') },
    { url: '/users/byId/:id'; exported: typeof import('./user/byId/get.js') },
    { url: '/user'; exported: typeof import('./user/create.js') },
    { url: '/user/list'; exported: typeof import('./user/list.js') },
  ]
>;
