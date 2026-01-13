import { useMemo } from 'react';

import { classNames } from '../../utils/classNames';
import { Typography } from '../Typography';
import styles from './LineCountingText.module.scss';

export interface LineCountingTextProps {
  className?: string;
  text: string;
}

export function LineCountingText({ className, text }: LineCountingTextProps) {
  const lines = useMemo(
    () => text.split('\n').map((line) => (line.length === 0 ? ' ' : line)),
    [text]
  );

  return (
    <div className={classNames(styles.root, className)}>
      {lines.flatMap((line, i) => [
        <Typography
          key={`${i}-num`}
          className={styles.number}
          data-content={i + 1}
        />,
        <Typography as="pre" key={`${i}-content`} className={styles.line}>
          {line}
        </Typography>,
      ])}
    </div>
  );
}
