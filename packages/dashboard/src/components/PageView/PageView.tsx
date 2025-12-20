import {
  classNames,
  type PageUrlWithMaybeSearchParams,
  Pagination,
} from '@game-cms/ui';
import type { ReactNode } from 'react';

import styles from './PageView.module.scss';

export interface PageViewProps {
  className?: string;
  page: number;
  pageSize: number;
  totalItems: number;
  getLink: (page: number) => PageUrlWithMaybeSearchParams;
  children: ReactNode;
}

export function PageView({
  className,
  page,
  pageSize,
  totalItems,
  getLink,
  children,
}: PageViewProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className={classNames(styles.root, className)}>
      {children}
      <Pagination
        current={page}
        total={totalPages}
        getLink={getLink}
        className={styles.pagination}
      />
    </div>
  );
}
