import { entity, file } from 'game-cms';

export default entity({
  id: 'demo::test',
  title: 'Test',
  components: {
    item1: file({
      options: {},
    }),
  },
});
