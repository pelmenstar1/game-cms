import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { ArrowLeftIcon, ArrowRightIcon } from '../../icons';
import type { PageUrlWithMaybeSearchParams } from '../../types/options';
import { classNames } from '../../utils/classNames';
import { Typography } from '../Typography';
import { getViewPages } from './pages';
import styles from './Pagination.module.scss';

export type PaginationProps = {
  className?: string;
  current: number;
  total: number;

  getLink: (page: number) => PageUrlWithMaybeSearchParams;
};

type PageItemProps = {
  page: number;
  href: PageUrlWithMaybeSearchParams;
  current: boolean;
};

function PageItem({ page, href, current }: PageItemProps) {
  return (
    <li className={classNames(current && styles['item-current'])}>
      {current ? (
        <Typography
          aria-label={`Поточна сторінка, сторінка ${page}`}
          aria-current
        >
          {page}
        </Typography>
      ) : (
        <Link to={href} aria-label={`Перейти на сторінку ${page}`}>
          <span>{page}</span>
        </Link>
      )}
    </li>
  );
}

function Delimiter() {
  return (
    <li aria-hidden className={styles.delimiter}>
      ...
    </li>
  );
}

type BackForwardButtonProps = {
  href: PageUrlWithMaybeSearchParams;
  className?: string;
  children: ReactNode;
};

function BackForwardButton({
  href,
  className,
  children,
  ...rest
}: BackForwardButtonProps) {
  return (
    <Link
      to={href}
      className={classNames(styles['back-forward'], className)}
      {...rest}
    >
      {children}
    </Link>
  );
}

export function Pagination({
  className,
  current,
  total,
  getLink,
}: PaginationProps) {
  const items = getViewPages(current, total).map((page) =>
    page === null ? (
      <Delimiter key={`delimiter-${page}`} />
    ) : (
      <PageItem
        key={page}
        page={page}
        href={getLink(page)}
        current={page === current}
      />
    )
  );

  return (
    <nav
      role="navigation"
      aria-label="Сторінки"
      className={classNames(styles.root, className)}
    >
      {current > 1 && (
        <BackForwardButton href={getLink(1)} aria-label="Попередня сторінка">
          <ArrowLeftIcon />
        </BackForwardButton>
      )}
      <ul>{items}</ul>

      {current < total && (
        <BackForwardButton
          href={getLink(total)}
          className={styles.forward}
          aria-label="Наступна сторінка"
        >
          <ArrowRightIcon />
        </BackForwardButton>
      )}
    </nav>
  );
}
