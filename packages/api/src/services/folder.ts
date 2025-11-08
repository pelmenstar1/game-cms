import { service } from '@game-cms/shared-api';

function collection() {
  return cms.service('base::database').collection('base::folders');
}

export default service({
  id: 'base::folder',
  create: async () => {},
});
