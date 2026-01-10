import { entity, number, text } from 'game-cms';

export default entity({
  id: 'demo::test',
  title: 'Test',
  components: {
    abc: number({
      integer: true,
      min: 1,
      max: 5,
    }),
    abc2: text({
      minLength: 1,
    }),
  },
});
