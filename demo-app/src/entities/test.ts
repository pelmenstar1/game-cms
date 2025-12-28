import { alternative, compose, entity, repeatable, text } from 'game-cms';

export default entity({
  id: 'demo::test',
  title: 'Test',
  components: {
    field1: text({
      options: {
        minLength: 3,
      },
    }),
    field2: repeatable(
      alternative(
        text({
          options: {
            minLength: 1,
          },
        })
      )
    ),
    field3: compose({
      inner1: text({
        options: {
          minLength: 3,
        },
      }),
      inner2: text({
        options: {},
      }),
    }),
  },
});
