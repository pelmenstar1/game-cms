import { RelativeTime } from '@game-cms/shared/chrono';

export type ExpirationTimeType = 'userSession' | 'userRefresh' | 'apiToken';

export type AuthConfig = {
  jwtSignKey: string | Uint8Array | CryptoKey;
  admin: {
    email: string;
    password: string;
  };
  expirationTimes?: Partial<Record<ExpirationTimeType, RelativeTime | number>>;
  apiToken?: {
    byteLength?: number;
  };
};

declare module '@game-cms/core' {
  interface UnresolvedCmsConfig {
    auth: AuthConfig;
  }
}
