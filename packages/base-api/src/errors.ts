declare module '@game-cms/types' {
  interface ApiErrorCodeMap {
    base: {
      entity: ['notFound', 'duplicate'];
      schema: ['validation'];
      access: ['unauthorized'];
      server: ['interalError'];
    };
  }
}
