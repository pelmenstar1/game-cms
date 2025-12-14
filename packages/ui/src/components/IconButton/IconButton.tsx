import type { TitleRequiredProps } from '../../types/react';
import type { ImpersonatedProps } from '../../utils/impersonation';
import {
  IconComponentBase,
  type IconComponentBaseProps,
} from '../IconComponentBase';

export type BaseIconButtonProps = Omit<
  ImpersonatedProps<IconComponentBaseProps, 'button'>,
  'as' | 'title' | 'aria-hidden'
>;

export type IconButtonProps = BaseIconButtonProps & TitleRequiredProps;

export function IconButton(props: IconButtonProps) {
  return <IconComponentBase as="button" {...props} />;
}
