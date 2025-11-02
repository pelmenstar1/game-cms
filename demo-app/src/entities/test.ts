import { entity, text } from 'game-cms';

export default entity({
  id: 'demo::test',
  title: 'Test',
  components: {
    field1: text({
      name: 'Field 1',
      options: [],
    }),
  },
});
