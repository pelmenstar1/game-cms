import type { UnresolvedCmsConfig } from '@game-cms/core';
import type { MaybePromise } from '@game-cms/shared';
import type { EnvAccessor } from '@game-cms/shared/io';

type MaybeEnv<R extends object> = R | ((env: EnvAccessor) => MaybePromise<R>);

export type ConfigInit = MaybeEnv<UnresolvedCmsConfig>;
