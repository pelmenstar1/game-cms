import { classNames, PageInteractionProps, Pagination } from '@game-cms/ui';
import type { ReactNode } from 'react';

import styles from './PageView.module.scss';

export type PageViewProps = PageInteractionProps & {
  className?: string;
  page: number;
  pageSize: number;
  totalItems: number;
  children: ReactNode;
};

export function PageView({
  className,
  page,
  pageSize,
  totalItems,
  children,
  ...interaction
}: PageViewProps) {
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
