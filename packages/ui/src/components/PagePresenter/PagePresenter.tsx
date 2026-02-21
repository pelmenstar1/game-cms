import type { ReactNode } from 'react';

import { classNames } from '../../utils/classNames';
import { type PageInteractionProps, Pagination } from '../Pagination';
import styles from './PageView.module.scss';

export type PagePresenterProps = PageInteractionProps & {
  className?: string;
  page: number;
  pageSize: number;
  totalItems: number;
  children: ReactNode;
};

export function PagePresenter({
  className,
  page,
  pageSize,
  totalItems,
  children,
  ...interaction
}: PagePresenterProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className={classNames(styles.root, className)}>
      {children}

      <Pagination
        current={page}
        total={totalPages}
        className={styles.pagination}
        {...interaction}
      />
    </div>
  );
}
