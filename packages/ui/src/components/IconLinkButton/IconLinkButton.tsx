import { Link } from 'react-router';

import type { TitleRequiredProps } from '../../types/react';
import type {
  ImpersonatedName,
  ImpersonatedProps,
} from '../../utils/impersonation';
import {
  IconComponentBase,
  type IconComponentBaseProps,
} from '../IconComponentBase';

type PropsOf<T extends ImpersonatedName> = Omit<
  ImpersonatedProps<IconComponentBaseProps, T>,
  'as' | 'title' | 'aria-hidden'
>;

type IconLinkButtonProps = (
  | (PropsOf<typeof Link> & { plainLink?: false })
  | (PropsOf<'a'> & { plainLink: true })
) &
  TitleRequiredProps;

export function IconLinkButton({ plainLink, ...rest }: IconLinkButtonProps) {
  return <IconComponentBase as={plainLink ? 'a' : Link} {...rest} />;
}
