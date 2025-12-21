import type { MaybePromise } from '@game-cms/shared';
import type { EnvAccessor } from '@game-cms/shared/io';
import type { UnresolvedCmsConfig } from '@game-cms/types';

type MaybeEnv<R extends object> = R | ((env: EnvAccessor) => MaybePromise<R>);

export type ConfigInit = MaybeEnv<UnresolvedCmsConfig>;
