import type { MaybeConcat } from '@game-cms/shared';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UIOptions {}

export type PageUrl = UIOptions extends { url: infer Url } ? Url : string;

export type PageUrlWithMaybeSearchParams = MaybeConcat<PageUrl, `?${string}`>;
