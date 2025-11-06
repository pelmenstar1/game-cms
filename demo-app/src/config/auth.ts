import type { AuthInit } from 'game-cms';

export const config: AuthInit = async (env) => ({
  jwtSignKey: await env.pemFile('./private-key-jwt.pem', 'RS256'),
  admin: {
    email: 'admin@demo.app',
    password: 'admin',
  },
});
