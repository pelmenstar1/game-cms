import '@game-cms/core/api';

declare module '@game-cms/core/api' {
  interface ApiRouteMap {
    'GET /auth/permissions': typeof import('./auth/permissions/get.js');
    'GET /auth/permissions/self': typeof import('./auth/permissions/self.js');
    'DELETE /auth/token/byId/:id': typeof import('./auth/token/byId/delete.js');
    'GET /auth/token/byId/:id': typeof import('./auth/token/byId/get.js');
    'POST /auth/token': typeof import('./auth/token/create.js');
    'GET /auth/token/list': typeof import('./auth/token/list/get.js');
    'POST /auth/token/jwt': typeof import('./auth/token/signin.js');
    'POST /auth/user/refresh': typeof import('./auth/user/refresh.js');
    'POST /auth/user/signin': typeof import('./auth/user/signin.js');
    'GET /entitySchema/byId/:id': typeof import('./entitySchema/get.js');
    'GET /entitySchema/list': typeof import('./entitySchema/list.js');
    'DELETE /entity/:entityId/byId/:id': typeof import('./entity/byId/delete.js');
    'GET /entity/:entityId/byId/:id': typeof import('./entity/byId/get.js');
    'PUT /entity/:entityId/byId/:id': typeof import('./entity/byId/update.js');
    'POST /entity/:entityId': typeof import('./entity/create.js');
    'GET /entity/:entityId/list': typeof import('./entity/list.js');
    'GET /entity/:entityId/raw/byId/:id': typeof import('./entity/raw/byId/get.js');
    'DELETE /storage/byId/:id': typeof import('./storage/byId/delete.js');
    'GET /storage/byId/:id': typeof import('./storage/byId/get.js');
    'POST /storage/file': typeof import('./storage/file/upload.js');
    'POST /storage/folder': typeof import('./storage/folder/create.js');
    'GET /storage/list': typeof import('./storage/list/get.js');
    'DELETE /user/byId/:id': typeof import('./user/byId/delete.js');
    'GET /users/byId/:id': typeof import('./user/byId/get.js');
    'POST /user': typeof import('./user/create.js');
    'GET /user/list': typeof import('./user/list.js');
  }
}
