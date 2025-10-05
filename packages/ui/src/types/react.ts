export type TitleRequiredProps =
  | {
      'aria-hidden': true;
      title?: string;
    }
  | {
      'aria-hidden'?: false;
      title: string;
    };
