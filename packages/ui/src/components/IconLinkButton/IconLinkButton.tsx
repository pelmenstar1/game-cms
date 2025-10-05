import { Link } from 'react-router';

import { TitleRequiredProps } from '../../types/react';
import { ImpersonatedName, ImpersonatedProps } from '../../utils/impersonation';
import {
  IconComponentBase,
  IconComponentBaseProps,
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
