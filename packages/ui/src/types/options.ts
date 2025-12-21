import type { MaybeConcat } from '@game-cms/shared';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UIOptions {}

type BasePageUrl = UIOptions extends { url: infer Url } ? Url : string;
export type PageUrl = MaybeConcat<BasePageUrl, `?${string}`>;
