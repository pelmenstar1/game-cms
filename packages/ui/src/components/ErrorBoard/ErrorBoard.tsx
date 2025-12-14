import { type ValidationResult } from '../../hooks';
import { ExclamationIcon } from '../../icons';
import { classNames } from '../../utils/classNames';
import { Typography } from '../Typography';
import styles from './ErrorBoard.module.scss';

export type ErrorBoardProps = {
  className?: string;
  items: (string | undefined | false)[] | ValidationResult;
};

function getErrors(items: ErrorBoardProps['items']) {
  return Array.isArray(items)
    ? items.filter((x): x is string => !!x)
    : Object.values(items)
        .filter(([condition]) => !condition)
        .map(([, title]) => title);
}

export function ErrorBoard({ className, items }: ErrorBoardProps) {
  const errors = getErrors(items);
  if (errors.length === 0) {
    return undefined;
  }

  return (
    <ul className={classNames(styles.root, className)}>
      {errors.map((item) => (
        <li key={item}>
          <ExclamationIcon aria-hidden />
          <Typography>{item}</Typography>
        </li>
      ))}
    </ul>
  );
}
