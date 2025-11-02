import { apiRoute } from '@game-cms/utils';

export default apiRoute({
  path: '/error',
  method: 'GET',
  handler: () => {
    throw new Error('wrong');
  },
});
