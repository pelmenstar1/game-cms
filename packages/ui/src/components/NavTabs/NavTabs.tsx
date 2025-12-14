import type { ReactNode } from 'react';
import { useLocation } from 'react-router';

import type { PageUrl } from '../../types/options';
import { classNames } from '../../utils/classNames';
import { Link } from '../Link';
import styles from './NavTabs.module.scss';

export type NavTabInfo = {
  icon?: ReactNode;
  text: string;
  href: PageUrl;
};

export interface NavTabsProps {
  className?: string;
  items: NavTabInfo[];
}

export function NavTabs({ className, items }: NavTabsProps) {
  const { pathname } = useLocation();

  return (
    <div className={classNames(styles.root, className)}>
      {items.map(({ href, text, icon }) => (
        <Link
          key={href}
          className={classNames(
            styles.item,
            (href !== '/' || pathname === href) &&
              pathname.startsWith(href) &&
              styles['item-active']
          )}
          to={href}
          title={text}
        >
          {icon}
          {text}
        </Link>
      ))}
    </div>
  );
}
