import { TitleRequiredProps } from '../../types/react';
import { ImpersonatedProps } from '../../utils/impersonation';
import {
  IconComponentBase,
  IconComponentBaseProps,
} from '../IconComponentBase';

export type BaseIconButtonProps = Omit<
  ImpersonatedProps<IconComponentBaseProps, 'button'>,
  'as' | 'title' | 'aria-hidden'
>;

export type IconButtonProps = BaseIconButtonProps & TitleRequiredProps;

export function IconButton(props: IconButtonProps) {
  return <IconComponentBase as="button" {...props} />;
}
