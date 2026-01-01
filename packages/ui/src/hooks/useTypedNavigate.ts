import type { MaybePromise } from '@game-cms/shared';
import { type NavigateOptions, useNavigate } from 'react-router';

import type { PageUrl } from '../types/options';

export type TypedNavigateFunction = {
  (to: PageUrl, options?: NavigateOptions): MaybePromise<void>;
  (delta: number): MaybePromise<void>;
};

export const useTypedNavigate = useNavigate as () => TypedNavigateFunction;
