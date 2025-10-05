import {
  ComponentProps,
  JSX,
  JSXElementConstructor,
  ReactElement,
} from 'react';

export type ImpersonatedName =
  | keyof JSX.IntrinsicElements
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | JSXElementConstructor<any>;

export type ImpersonatedProps<
  Base,
  As extends ImpersonatedName,
> = ComponentProps<As> &
  Base & {
    as: As;
  };

export type ImpersonatedComponent<Base, Default extends ImpersonatedName> = {
  <As extends ImpersonatedName>(
    props: ImpersonatedProps<Base, As>
  ): ReactElement;
  (props: Base & ComponentProps<Default>): ReactElement;
};

export function impersonatedComponent<Base, Default extends ImpersonatedName>(
  factory: (props: Base & { as?: ImpersonatedName }) => ReactElement
): ImpersonatedComponent<Base, Default> {
  return factory;
}
