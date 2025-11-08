import type { EnvAccessor, MaybePromise } from '@game-cms/shared';
import type { CmsConfig } from '@game-cms/types';

type MaybeEnv<R extends object> = R | ((env: EnvAccessor) => MaybePromise<R>);

export type ConfigInit = MaybeEnv<CmsConfig>;
