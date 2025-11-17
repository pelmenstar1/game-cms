declare module '@game-cms/types' {
  interface ApiRouteMap {
    'GET /auth/permissions': typeof import('./auth/permissions/get.js');
    'POST /auth/token': typeof import('./auth/token/create.js');
    'DELETE /auth/token': typeof import('./auth/token/delete.js');
    'POST /auth/token/jwt': typeof import('./auth/token/signin.js');
    'POST /auth/user/signin': typeof import('./auth/user/signin.js');
    'GET /_components/:id/assets/*': typeof import('./components/assets.js');
    'GET /_components/:id/manifest.json': typeof import('./components/manifest.js');
    'DELETE /entity/:entityId/byId/:id': typeof import('./entity/byId/delete.js');
    'GET /entity/:entityId/byId/:id': typeof import('./entity/byId/get.js');
    'PUT /entity/:entityId/byId/:id': typeof import('./entity/byId/update.js');
    'POST /entity/:entityId': typeof import('./entity/create.js');
    'GET /entity/:entityId/list': typeof import('./entity/list.js');
    'GET /entity/:entityid/raw/byId/:id': typeof import('./entity/raw/byId/get.js');
    'GET /entitySchema/byId/:id': typeof import('./entitySchema/get.js');
    'GET /entitySchema/list': typeof import('./entitySchema/list.js');
    'DELETE /file/byId/:fileId': typeof import('./file/byId/delete.js');
    'GET /file/byId/:fileId': typeof import('./file/byId/get.js');
    'GET /file/list': typeof import('./file/list/get.js');
    'POST /file': typeof import('./file/upload.js');
    'DELETE /folder/byId/:folderId': typeof import('./folder/byId/delete.js');
    'GET /folder/byId/:folderId': typeof import('./folder/byId/get.js');
    'PUT /folder/byId/:folderId': typeof import('./folder/byId/update.js');
    'POST /folder': typeof import('./folder/create.js');
    'GET /assets/_s/:scope/:name.js': typeof import('./sharedAssets/route.js');
    'DELETE /user/byId/:id': typeof import('./user/byId/delete.js');
    'GET /users/byId/:id': typeof import('./user/byId/get.js');
    'POST /user': typeof import('./user/create.js');
    'GET /user/list': typeof import('./user/list.js');
  }
}
