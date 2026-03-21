import type { MaybeConcat } from '@game-cms/shared';

export interface UIOptions {}

type BasePageUrl = UIOptions extends { url: infer Url } ? Url : string;
export type PageUrl = MaybeConcat<BasePageUrl, `?${string}`>;
