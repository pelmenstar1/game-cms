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
  collapsable?: boolean;
  items: NavTabInfo[];
}

export function NavTabs({ className, collapsable, items }: NavTabsProps) {
  const { pathname } = useLocation();

  return (
    <div
      className={classNames(
        styles.root,
        collapsable && styles['root-collapsable'],
        className
      )}
    >
      {items.map(({ href, text, icon }) => {
        const isActive =
          (href !== '/' || pathname === href) && pathname.startsWith(href);

        const className = classNames(
          styles.item,

          isActive && styles['item-active']
        );

        return (
          <Link key={href} className={className} to={href} title={text}>
            {icon}
            <span className={styles['item-text']}>{text}</span>
          </Link>
        );
      })}
    </div>
  );
}
