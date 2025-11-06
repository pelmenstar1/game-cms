import type { AuthInit } from 'game-cms';

export const config: AuthInit = (env) => ({
  jwtSignKey: env('JWT_SECRET_KEY'),
  admin: {
    email: 'admin@demo.app',
    password: 'admin',
  },
});
