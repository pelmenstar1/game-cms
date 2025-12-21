import type { MaybePromise } from '@game-cms/shared';
import type { PageUrl } from '@game-cms/ui';
import { type NavigateOptions, useNavigate } from 'react-router';

export type TypedNavigateFunction = {
  (to: PageUrl, options?: NavigateOptions): MaybePromise<void>;
  (delta: number): MaybePromise<void>;
};

export const useTypedNavigate = useNavigate as () => TypedNavigateFunction;
