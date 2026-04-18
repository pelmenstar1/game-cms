import type { ComponentProps, ReactNode } from 'react';
import { Link } from 'react-router';

import { ArrowLeftIcon, ArrowRightIcon } from '../../icons';
import type { PageUrl } from '../../types/options';
import { classNames } from '../../utils/classNames';
import { Button } from '../Button';
import { Typography } from '../Typography';
import { getViewPages } from './pages';
import styles from './Pagination.module.scss';

export type PageInteractionProps =
  | {
      getLink: (page: number) => PageUrl;
    }
  | {
      onButtonClick: (page: number) => void;
    };

export type PaginationProps = PageInteractionProps & {
  className?: string;
  current: number;
  total: number;
};

type InteractionButtonProps = (ComponentProps<'button'> &
  Omit<ComponentProps<typeof Link>, 'to'>) & {
  interaction: PageInteractionProps;
  page: number;
  children?: ReactNode;
};

function InteractionButton({
  interaction,
  page,
  ...rest
}: InteractionButtonProps) {
  if ('getLink' in interaction) {
    return <Link to={interaction.getLink(page)} {...rest} />;
  }

  return (
    <Button
      onClick={() => {
        interaction.onButtonClick(page);
      }}
      {...rest}
    />
  );
}

type PageItemProps = {
  page: number;
  current: boolean;
  interaction: PageInteractionProps;
};

function PageItem({ page, current, interaction }: PageItemProps) {
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
        <InteractionButton
          interaction={interaction}
          page={page}
          aria-label={`Перейти на сторінку ${page}`}
        >
          <span>{page}</span>
        </InteractionButton>
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

interface BackForwardButtonProps extends InteractionButtonProps {
  className?: string;
  page: number;
  interaction: PageInteractionProps;
  visible: boolean;
  children: ReactNode;
}

function BackForwardButton({
  className,
  interaction,
  page,
  visible,
  children,
  ...rest
}: BackForwardButtonProps) {
  return (
    <InteractionButton
      className={classNames(
        styles['back-forward'],
        visible && styles['back-forward-visible'],
        className
      )}
      interaction={interaction}
      page={page}
      {...rest}
    >
      {children}
    </InteractionButton>
  );
}

export function Pagination({
  className,
  current,
  total,
  ...buttonProps
}: PaginationProps) {
  const items = getViewPages(current, total).map((page) =>
    page === null ? (
      <Delimiter key={`delimiter-${page}`} />
    ) : (
      <PageItem
        key={page}
        page={page}
        current={page === current}
        interaction={buttonProps}
      />
    )
  );

  return (
    <nav
      role="navigation"
      aria-label="Сторінки"
      className={classNames(styles.root, className)}
    >
      <BackForwardButton
        interaction={buttonProps}
        page={current - 1}
        aria-label="Попередня сторінка"
        visible={current > 1}
      >
        <ArrowLeftIcon />
      </BackForwardButton>

      <ul>{items}</ul>

      <BackForwardButton
        interaction={buttonProps}
        page={current + 1}
        className={styles.forward}
        visible={current < total}
        aria-label="Наступна сторінка"
      >
        <ArrowRightIcon />
      </BackForwardButton>
    </nav>
  );
}
