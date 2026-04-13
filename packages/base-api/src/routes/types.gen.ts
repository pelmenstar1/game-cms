import '@game-cms/core/api';

declare module '@game-cms/core/api' {
  interface ApiRouteMap {
    'GET /auth/permissions': typeof import('./auth/permissions/get.js');
    'GET /auth/permissions/public': typeof import('./auth/permissions/public/get.js');
    'PUT /auth/permissions/public': typeof import('./auth/permissions/public/update.js');
    'GET /auth/session/self': typeof import('./auth/session/self.js');
    'DELETE /auth/token/byId/:id': typeof import('./auth/token/byId/delete.js');
    'GET /auth/token/byId/:id': typeof import('./auth/token/byId/get.js');
    'POST /auth/token': typeof import('./auth/token/create.js');
    'GET /auth/token/list': typeof import('./auth/token/list/get.js');
    'POST /auth/token/jwt': typeof import('./auth/token/signin.js');
    'POST /auth/user/refresh': typeof import('./auth/user/refresh.js');
    'POST /auth/user/signin': typeof import('./auth/user/signin.js');
    'GET /entityCheck/runs': typeof import('./entityCheck/runs/list.js');
    'GET /entityChecks/runs/:id': typeof import('./entityCheck/runs/[id]/get.js');
    'GET /entitySchema/byId/:id': typeof import('./entitySchema/get.js');
    'GET /entitySchema/list': typeof import('./entitySchema/list.js');
    'DELETE /entity/:entityId/byId/:id': typeof import('./entity/byId/delete.js');
    'GET /entity/:entityId/byId/:id': typeof import('./entity/byId/get.js');
    'POST /entity/:entityId/byId/:id/unpublish': typeof import('./entity/byId/unpublish.js');
    'PUT /entity/:entityId/byId/:id': typeof import('./entity/byId/update.js');
    'POST /entity/:entityId/:entityDocumentId/check/:checkId/:actionId': typeof import('./entity/check/action.js');
    'POST /entity/:entityId': typeof import('./entity/create.js');
    'GET /entity/:entityId/internal/byId/:id': typeof import('./entity/internal/byId/get.js');
    'GET /entity/:entityId/list': typeof import('./entity/list.js');
    'GET /entity/:entityId/search': typeof import('./entity/search/get.js');
    'DELETE /storage/byId/:id': typeof import('./storage/byId/delete.js');
    'GET /storage/byId/:id': typeof import('./storage/byId/get.js');
    'GET /storage/file/:id/trace': typeof import('./storage/file/trace.js');
    'POST /storage/file': typeof import('./storage/file/upload.js');
    'POST /storage/folder': typeof import('./storage/folder/create.js');
    'GET /storage/list': typeof import('./storage/list/get.js');
    'DELETE /user/byId/:id': typeof import('./user/byId/delete.js');
    'GET /user/byId/:id': typeof import('./user/byId/get.js');
    'PUT /user/byId/:id': typeof import('./user/byId/update.js');
    'POST /user': typeof import('./user/create.js');
    'GET /user/list': typeof import('./user/list.js');
  }
}
