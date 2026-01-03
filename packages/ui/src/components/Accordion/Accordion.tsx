import { type ReactNode, useState } from 'react';

import { ArrowDownIcon } from '../../icons';
import { classNames } from '../../utils/classNames';
import { Typography } from '../Typography';
import styles from './Accordion.module.scss';

export interface AccordionProps {
  className?: string;
  headerClassName?: string;
  initiallyOpened?: boolean;
  title: string;
  children: ReactNode;
  headerContent?: ReactNode;
}

export function Accordion({
  className,
  headerClassName,
  headerContent,
  title,
  children,
  initiallyOpened = false,
}: AccordionProps) {
  const [isOpened, setOpened] = useState(initiallyOpened);

  const onSwitch = () => {
    setOpened((prev) => !prev);
  };

  return (
    <div
      className={classNames(
        styles.root,
        isOpened && styles['root-open'],
        className
      )}
    >
      <div
        className={classNames(styles.header, headerClassName)}
        onClick={onSwitch}
      >
        <Typography weight="bold" className={styles['header-title']}>
          {title}
        </Typography>

        {headerContent}
        <ArrowDownIcon className={styles['header-icon']} />
      </div>

      {isOpened && <div className={styles.content}>{children}</div>}
    </div>
  );
}
