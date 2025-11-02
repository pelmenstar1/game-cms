import { apiRoute } from '@game-cms/utils';

export default apiRoute({
  url: '/error',
  method: 'GET',
  handler: () => {
    throw new Error('wrong');
  },
});
